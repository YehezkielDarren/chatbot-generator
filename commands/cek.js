const { EmbedBuilder } = require("discord.js");

const statsConfig = {
  iq: {
    label: "Cek IQ Anda",
    emoji: "🧠",
    unit: "IQ",
    max: 200,
    replies: [
      { threshold: 50, text: "Hmm, sepertinya hari ini sedang tidak fokus." },
      { threshold: 80, text: "Standar, sama seperti yang lain." },
      { threshold: 110, text: "Cerdas! Kamu punya potensi." },
      { threshold: 140, text: "Jenius! Ide-idemu brilian." },
      {
        threshold: 200,
        text: "Galaxy Brain! Kamu melihat alam semesta dalam matriks.",
      },
    ],
  },
  jawir: {
    label: "Seberapa Jawir Anda",
    emoji: "👑",
    unit: "%",
    max: 100,
    replies: [
      { threshold: 25, text: "Anda masih aman, jauh dari kata 'jawir'." },
      { threshold: 50, text: "Gejala-gejala ringan mulai tampak." },
      {
        threshold: 75,
        text: "Sudah tidak bisa diselamatkan, Anda adalah sesepuh.",
      },
      { threshold: 100, text: "Selamat, Anda adalah The Absolute Jawir!" },
    ],
    aliases: ["ireng"],
  },
  ganteng: {
    label: "Kalkulator Ketampanan",
    emoji: "😎",
    unit: "%",
    max: 100,
    replies: [
      { threshold: 50, text: "Tidak apa-apa, yang penting hati." },
      { threshold: 80, text: "Cukup menawan, banyak yang melirik." },
      { threshold: 95, text: "Sangat tampan, bisa jadi model!" },
      { threshold: 100, text: "Ketampanan Anda membuat dunia silau!" },
    ],
  },
  gay: {
    label: "Gay Meter",
    emoji: "🏳️‍🌈",
    unit: "%",
    max: 100,
    replies: [
      { threshold: 25, text: "Anda masih aman, jauh dari kata 'gay'." },
      { threshold: 50, text: "Harap dicurigai anda!!" },
      { threshold: 75, text: "Menjauhlah dari orang ini!!!" },
      { threshold: 100, text: "III... Jomoknyeee...." },
    ],
    aliases: ["jomok", "lesbi", "ngawi"],
  },
  wibu: {
    label: "Tingkat Kewibuan",
    emoji: "🌸",
    unit: "%",
    max: 100,
    replies: [
      { threshold: 25, text: "Anda hanya penikmat biasa." },
      { threshold: 50, text: "Sudah mulai mengoleksi merchandise." },
      { threshold: 75, text: "Waifu Anda adalah segalanya." },
      {
        threshold: 100,
        text: "Anda sudah menjadi warga kehormatan Akihabara.",
      },
    ],
    aliases: ["bau-bawang"],
  },
  // ...
};

function deterministicRandom(seedString, max) {
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed += seedString.charCodeAt(i);
  }
  // Menggunakan operasi matematika sederhana untuk hasil yang 'acak' tapi konsisten
  const x = Math.sin(seed) * 10000;
  const randomValue = Math.abs(Math.floor((x - Math.floor(x)) * (max + 1)));
  return randomValue;
}

function getReply(value, replies) {
  for (const reply of replies) {
    if (value <= reply.threshold) {
      return reply.text;
    }
  }
  return "Hasil yang luar biasa!";
}

module.exports = {
  name: "cek",
  description: "Mengecek berbagai statistik acakmu untuk hari ini!!!",
  usage: "#cek <jenis_cek> [@user_teman]",
  aliases: ["check"],
  execute(message, args) {
    const statToCheck = args[0]?.toLowerCase();

    // Jika tidak ada argumen, tampilkan daftar 'cek' yang tersedia
    if (!statToCheck) {
      const availableStats = Object.keys(statsConfig).join(", ");
      return message.reply(
        `Silakan pilih apa yang ingin dicek. Contoh: \`!cek iq\`\nOpsi tersedia: ${availableStats}`
      );
    }

    const configKey = Object.keys(statsConfig).find(
      (key) =>
        key === statToCheck ||
        (statsConfig[key].aliases &&
          statsConfig[key].aliases.includes(statToCheck))
    );

    // apakah jenis "cek" valid
    if (!configKey) {
      return message.reply(
        `Jenis "cek" tidak valid. Coba salah satu dari: ${Object.keys(
          statsConfig
        ).join(", ")}`
      );
    }

    // Tentukan target: user yang di-mention, atau pengirim pesan jika tidak ada mention
    const targetUser = message.mentions.users.first() || message.author;
    const targetUsername = targetUser.tag;
    const config = statsConfig[configKey];

    // Buat "benih" unik dari ID pengguna dan tanggal hari ini
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const seedString = targetUser.id + today + config.label;

    // Hasilkan angka acak yang konsisten
    let randomValue = deterministicRandom(seedString, config.max);

    // pengecualian
    if (
      (configKey === "jawir" || configKey === "ireng") &&
      (targetUser.id === "691292862997987428" ||
        targetUsername.includes("idk.id"))
    ) {
      console.log(
        `[OVERRIDE] Target user ${targetUser.tag} terdeteksi sebagai The Absolute Jawir.`
      );
      randomValue = 100;
    }
    if (
      (configKey === "gay" || configKey === "jomok" || configKey === "ngawi") &&
      (targetUser.id === "450441663668813836" ||
        targetUsername.includes("noiro_0"))
    ) {
      console.log(
        `[OVERRIDE] Target user ${targetUser.tag} terdeteksi sebagai The Absolute ${configKey}ers.`
      );
      randomValue = 100;
    }
    if (
      (configKey === "wibu" || configKey === "bau-bawang") &&
      (targetUsername.includes("icyfantastic") ||
        targetUser.id === "541096366756200458")
    ) {
      console.log(
        `[OVERRIDE] Target user ${targetUser.tag} terdeteksi sebagai The Absolute Bau Bawang.`
      );
      randomValue = 100;
    }
    if (
      configKey === "iq" &&
      (targetUser.id === "753505735153025045" ||
        targetUsername.includes("narred7"))
    ) {
      console.log(
        `[OVERRIDE] Target user ${targetUser.tag} terdeteksi sebagai The next Albert Einstein.`
      );
      randomValue = 200;
    } else if (
      !(configKey === "iq" || configKey === "jawir" || configKey === "ireng") &&
      (targetUser.id === "753505735153025045" ||
        targetUsername.includes("narred7"))
    ) {
      console.log(
        `[OVERRIDE] Target user ${targetUser.tag} terdeteksi normal.`
      );
      randomValue = 0;
    }

    const replyText = getReply(randomValue, config.replies);

    // buat embed
    const embed = new EmbedBuilder()
      .setColor("#22a7f0")
      .setTitle(
        `${config.emoji} ${config.label} untuk ${targetUser.username} ${config.emoji}`
      )
      .setDescription(`### **${randomValue} ${config.unit}**`)
      .addFields({ name: "Catatan Hari Ini:", value: replyText })
      .setTimestamp()
      .setFooter({ text: "Hasil ini direset setiap hari." });

    message.channel.send({ embeds: [embed] });
  },
};
