import { getUrlFromDirectPath } from "baileys";

function formatCreationDate(timestamp) {
  if (!timestamp) return "غير متوفر";
  try {
    const date = new Date(timestamp);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'UTC',
      timeZoneName: 'short',
    };
    return date.toLocaleString('ar-EG', options);
  } catch {
    return "غير متوفر";
  }
}

let handler = async (m, { conn, text }) => {
  const channelInviteCode = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/)?([0-9A-Za-z]{22,24})/i)?.[1];
  if (!channelInviteCode) return await conn.reply(m.chat, "⚠ الرجاء إدخال رابط قناة واتساب صحيح.", m);

  try {
    const newsletterInfo = await conn.newsletterMetadata("invite", channelInviteCode);
    if (!newsletterInfo) return await conn.reply(m.chat, "❌ لم يتم العثور على معلومات القناة.", m);

    const { name, subscribers, preview, admins, description, creation, status, profileUrl } = newsletterInfo;
    const profilePicture = preview ? await (await fetch(getUrlFromDirectPath(preview))).buffer() : null;
    const creationDate = formatCreationDate(creation);

    let adminsList = '';
    if (admins && admins.length > 0) {
      adminsList = admins.map(admin => `- @${admin.split('@')[0]}`).join('\n');
    }

    const caption = `
✨🌀 معلومات القناة 🌀✨
╭───────────────────⟢ـ
│📌 اسم القناة: ${name || "غير متوفر"}
│📝 الوصف: ${description || "غير متوفر"}
│👥 عدد الأعضاء: ${subscribers ? subscribers.toLocaleString() : "غير متوفر"}
│📅 تاريخ الإنشاء: ${creationDate}
│🔗 رابط القناة: ${text}
│🔐 كود الدعوة: ${channelInviteCode || "غير متوفر"}
│🚦 الحالة: ${status ? "نشطة" : "غير نشطة"}
╰───────────────────⟢ـ

${adminsList ? `
👑 مشرفي القناة 👑
╭───────────────────⟢ـ
${adminsList}
╰───────────────────⟢ـ
` : ''}
`.trim();

    if (profilePicture) {
      await conn.sendMessage(m.chat, {
        image: profilePicture,
        caption: caption,
        mentions: admins || [],
        contextInfo: {
          externalAdReply: {
            title: name || "قناة واتساب",
            body: `عدد الأعضاء: ${subscribers ? subscribers.toLocaleString() : "غير متوفر"}`,
            thumbnail: profilePicture,
            sourceUrl: profileUrl || text,
            mediaType: 1,
            showAdAttribution: false,
            renderLargerThumbnail: false,
          },
        },
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        text: caption,
        mentions: admins || [],
        contextInfo: {
          externalAdReply: {
            title: name || "قناة واتساب",
            body: `عدد الأعضاء: ${subscribers ? subscribers.toLocaleString() : "غير متوفر"}`,
            thumbnailUrl: 'https://telegra.ph/file/0a4b8a8b1b9b9b9b9b9b9.jpg',
            sourceUrl: profileUrl || text,
            mediaType: 1,
            showAdAttribution: false,
            renderLargerThumbnail: false,
          },
        },
      }, { quoted: m });
    }

  } catch {
    await conn.reply(m.chat, "❌ حدث خطأ أثناء جلب معلومات القناة.", m);
  }
};

handler.help = ["inspectchannel"];
handler.tags = ['tools'];
handler.command = /^(قناه|القناه)$/i;

export default handler;