import os
import json
import secrets
import threading
import time
from pathlib import Path

import discord
from discord import app_commands
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from functools import wraps

load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")
PORT = int(os.getenv("PORT", 3001))
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "SLA@dm1n#P4$$w0rd!2026$X9kLmZq3Rt7vWbYnCfJ")
API_SECRET = os.getenv("API_SECRET", "")
GUILD_IDS = [1518701700586934342, 1516537211087224843]
DATA_FILE = Path(__file__).parent / "data.json"

# ===== Data persistence =====
def load_data():
    try:
        if DATA_FILE.exists():
            return json.loads(DATA_FILE.read_text())
    except Exception:
        pass
    return {"verifications": {}, "discord_links": {}, "tickets": []}

def save_data(data):
    DATA_FILE.write_text(json.dumps(data, indent=2))

data = load_data()

def require_secret(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if API_SECRET and request.headers.get("X-API-Secret") != API_SECRET:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return wrapper

# ===== Flask app =====
app = Flask(__name__, static_folder="../html-version", static_url_path="")
CORS(app)

@app.route("/")
def serve_index():
    return app.send_static_file("index.html")

@app.route("/<path:path>")
def serve_static(path):
    from werkzeug.utils import safe_join
    import os
    # Skip API routes
    if path.startswith("api/"):
        from flask import abort
        return abort(404)
    # Try to serve the file from html-version
    static_dir = app.static_folder
    filepath = safe_join(static_dir, path)
    if os.path.isfile(filepath):
        return app.send_static_file(path)
    # Fallback to index.html (SPA behavior)
    return app.send_static_file("index.html")

@app.route("/api/verify/generate", methods=["POST"])
def generate_code():
    body = request.get_json(silent=True) or {}
    discord_username = body.get("discordUsername", "")
    if not discord_username or not discord_username.startswith("@"):
        return jsonify({"error": "Discord username must start with @"}), 400
    code = secrets.token_hex(3).upper()
    data["verifications"][code] = {
        "discordUsername": discord_username,
        "verified": False,
        "userId": None,
        "createdAt": time.time()
    }
    # Clean old codes (> 10 min)
    cutoff = time.time() - 600
    data["verifications"] = {c: v for c, v in data["verifications"].items() if v["createdAt"] > cutoff}
    save_data(data)
    return jsonify({"code": code})

@app.route("/api/verify/check/<code>")
def check_code(code):
    v = data["verifications"].get(code.upper())
    if not v:
        return jsonify({"verified": False})
    if v["verified"]:
        return jsonify({"verified": True, "discordUsername": v["discordUsername"], "userId": v["userId"]})
    return jsonify({"verified": False})

@app.route("/api/tickets/notify", methods=["POST"])
@require_secret
def notify_ticket():
    body = request.get_json(silent=True) or {}
    discord_username = body.get("discordUsername")
    ticket_number = body.get("ticketNumber")
    status = body.get("status")
    reason = body.get("reason")
    if not discord_username or not ticket_number or not status:
        return jsonify({"error": "Missing required fields"}), 400
    link = data["discord_links"].get(discord_username.lower())
    if not link:
        return jsonify({"sent": False, "error": "User not verified with bot"})
    user_id = link["userId"]
    status_emoji = {"accepted": "\u2705", "denied": "\u274c", "in-review": "\U0001f50d", "pending": "\u23f3"}
    status_text = {"accepted": "Accepted", "denied": "Denied", "in-review": "In Review", "pending": "Pending"}
    emoji = status_emoji.get(status, "")
    text = status_text.get(status, status)
    msg = f"{emoji} **Ticket {ticket_number}** \u2014 {text}"
    if reason:
        msg += f"\n> {reason}"
    bot.loop.create_task(send_dm(user_id, msg))
    return jsonify({"sent": True})

@app.route("/api/tickets/sync", methods=["POST"])
@require_secret
def sync_tickets():
    body = request.get_json(silent=True) or {}
    tickets = body.get("tickets", [])
    data["tickets"] = tickets
    save_data(data)
    return jsonify({"synced": len(tickets)})

@app.route("/api/tickets", methods=["GET"])
def get_tickets():
    user_id = request.args.get("userId")
    username = request.args.get("discordUsername")
    tickets = data.get("tickets", [])
    if user_id:
        link = next((l for l in data["discord_links"].values() if l["userId"] == user_id), None)
        if link:
            username = link["discordUsername"]
    if username:
        tickets = [t for t in tickets if t.get("discordUsername", "").lower() == username.lower()]
    return jsonify({"tickets": tickets, "count": len(tickets)})

@app.route("/api/unlink", methods=["POST"])
@require_secret
def unlink():
    body = request.get_json(silent=True) or {}
    user_id = body.get("userId")
    username = body.get("discordUsername")
    if user_id:
        for key, link in list(data["discord_links"].items()):
            if link["userId"] == user_id:
                del data["discord_links"][key]
                break
    if username:
        data["discord_links"].pop(username.lower(), None)
    save_data(data)
    return jsonify({"unlinked": True})

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    body = request.get_json(silent=True) or {}
    if body.get("password") == ADMIN_PASSWORD:
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

@app.route("/api/status")
def status():
    return jsonify({"status": "ok", "botReady": bot.is_ready() if bot else False})

async def send_dm(user_id, message):
    try:
        user = await bot.fetch_user(int(user_id))
        await user.send(message)
    except Exception as e:
        print(f"Failed to send DM to {user_id}: {e}")

# ===== Discord Bot =====
class SLABot(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)

    async def on_ready(self):
        print(f"Bot logged in as {self.user}")
        # Clear stale guild commands and sync removal
        for gid in GUILD_IDS:
            try:
                self.tree.clear_commands(guild=discord.Object(id=gid))
                await self.tree.sync(guild=discord.Object(id=gid))
            except Exception as e:
                print(f"Skipped guild cleanup {gid}: {e}")
        # Sync current tree globally
        await self.tree.sync()
        print("Slash commands synced globally")

    async def setup_hook(self):
        async def safe_send(interaction, msg):
            try:
                if not interaction.response.is_done():
                    await interaction.response.send_message(msg, ephemeral=True)
                else:
                    await interaction.followup.send(msg, ephemeral=True)
            except:
                pass

        @self.tree.error
        async def on_error(interaction, error):
            await safe_send(interaction, f"An error occurred: {error}")

        @self.tree.command(name="verify", description="Verify your Discord account with the SLA website")
        @app_commands.describe(code="The verification code from the website")
        async def verify_cmd(interaction: discord.Interaction, code: str):
            try:
                code = code.upper()
                v = data["verifications"].get(code)
                if not v:
                    await safe_send(interaction, "Invalid or expired verification code. Generate a new one on the SLA website.")
                    return
                if v["verified"]:
                    await safe_send(interaction, "This code has already been used.")
                    return
                expected = v["discordUsername"].lstrip("@")
                if interaction.user.name.lower() != expected.lower():
                    await safe_send(interaction,
                        f"This code was generated for **{v['discordUsername']}**, "
                        f"but your Discord username is **@{interaction.user.name}**. "
                        f"Enter the correct @username on the website and generate a new code."
                    )
                    return
                v["verified"] = True
                v["userId"] = str(interaction.user.id)
                uid = str(interaction.user.id)
                for old_key in list(data["discord_links"].keys()):
                    if data["discord_links"][old_key]["userId"] == uid:
                        del data["discord_links"][old_key]
                data["discord_links"][v["discordUsername"].lower()] = {
                    "userId": uid,
                    "discordUsername": v["discordUsername"]
                }
                save_data(data)
                await safe_send(interaction,
                    f"Verified! Your Discord account ({interaction.user}) is now linked to "
                    f"**{v['discordUsername']}** on the SLA website."
                )
            except Exception as e:
                await safe_send(interaction, f"Verification failed: {e}")

        @self.tree.command(name="ticket", description="Check the status of one of your tickets")
        @app_commands.describe(ticket_number="Your ticket number (e.g. SLA-XXXXXX)")
        async def ticket_cmd(interaction: discord.Interaction, ticket_number: str):
            try:
                tickets = data.get("tickets", [])
                # Find by stored discord link (username stored as @user)
                user_discord = None
                for link in data["discord_links"].values():
                    if link["userId"] == str(interaction.user.id):
                        user_discord = link["discordUsername"].lower()
                        break
                if not user_discord:
                    await safe_send(interaction, "Your Discord is not linked. Use `/verify` first on the SLA website.")
                    return
                tn = ticket_number.upper()
                match = [t for t in tickets if t.get("discordUsername", "").lower() == user_discord and t.get("ticketNumber", "").upper() == tn]
                if not match:
                    await safe_send(interaction, f"No ticket found with number **{tn}** linked to your account.")
                    return
                t = match[0]
                icons = {"pending": "⏳", "accepted": "✅", "denied": "❌", "in-review": "🔍"}
                labels = {"pending": "Pending", "accepted": "Accepted", "denied": "Denied", "in-review": "In Review"}
                msg = (
                    f"{icons.get(t.get('status', ''), '❓')} **{t['ticketNumber']}** — {labels.get(t.get('status', ''), 'Unknown')}\n"
                    f"**Item:** {t.get('item', 'N/A')}\n"
                    f"**Player ID:** {t.get('playerId', 'N/A')}\n"
                    f"**Date:** {t.get('createdAt', 'N/A')[:10]}"
                )
                if t.get("reviewNotes"):
                    msg += f"\n**Note:** {t['reviewNotes']}"
                await safe_send(interaction, msg)
            except Exception as e:
                await safe_send(interaction, f"Failed to look up ticket: {e}")

        @self.tree.command(name="unlink", description="Unlink your Discord account from the SLA website")
        async def unlink_cmd(interaction: discord.Interaction):
            try:
                uid = str(interaction.user.id)
                removed = False
                for key, link in list(data["discord_links"].items()):
                    if link["userId"] == uid:
                        del data["discord_links"][key]
                        removed = True
                        break
                if removed:
                    save_data(data)
                    await safe_send(interaction, "Your Discord has been unlinked. You can re-verify anytime with `/verify`.")
                else:
                    await safe_send(interaction, "Your account is not currently linked.")
            except Exception as e:
                await safe_send(interaction, f"Failed to unlink: {e}")

bot = SLABot()

def run_bot():
    if TOKEN and TOKEN != "your_bot_token_here":
        bot.run(TOKEN)
    else:
        print("No DISCORD_TOKEN set. Bot not started. Set it in .env to enable Discord features.")

# ===== Start =====
if __name__ == "__main__":
    threading.Thread(target=run_bot, daemon=True).start()
    print(f"API server running on http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=False)
