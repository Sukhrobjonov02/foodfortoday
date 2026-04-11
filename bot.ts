import { Telegraf, Markup } from 'telegraf';

// ============================================================
// Daily Food Randomizer — Telegram Bot
// ============================================================
// 1. Get your bot token from @BotFather on Telegram
// 2. Set your Mini App URL (Vercel deployment or ngrok)
// 3. Run: npx tsx bot.ts
// ============================================================

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://your-app.vercel.app';

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "🍽 *Daily Food Randomizer*\n\nCan't decide what to cook today? Let the wheel decide\\!\n\nTap the button below to open the app\\.",
    {
      parse_mode: 'MarkdownV2',
      ...Markup.inlineKeyboard([
        Markup.button.webApp('🎰 Open Food Randomizer', WEB_APP_URL),
      ]),
    }
  );
});

bot.command('menu', (ctx) => {
  ctx.reply('Open the Food Randomizer:', {
    ...Markup.inlineKeyboard([
      Markup.button.webApp('🎰 Spin the Wheel', WEB_APP_URL),
    ]),
  });
});

bot.launch();

console.log('🤖 Bot is running...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
