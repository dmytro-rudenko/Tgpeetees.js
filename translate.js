module.exports = {
  EN: {
    hi: "Hi, I'm Psychologist. I can help you. Press the 'Share feelings' button with me.",
    help: `Here are the available commands:
      /start - Start interacting with the bot.
      /share - Share your feelings with the bot.
      /help - Display this help message.
      /language - Change the language of the bot.
Other text messages will be processed and responded to by the AI.`,
    selectLanguage: "Select your language:",
    share: "Share feelings",
    shareMore: "Share feelings more",
    sorry:
      "Sorry, I can't keep up the conversation. Press the 'Share feelings' button with me.",
    limit: "Limit of the conversation reached. Please, try again later.",
    pleaseWait: "Please wait...",
    youCanShare: "You can share your feelings with me on your native language.",
    prompt: `"Respond as if you are a psychologist to whom people describe their problems. Use the language of the subsequent message for your response. The answer should be as detailed as possible with advice on how to improve the condition.

Example request: Hi. Lately, I've been feeling constant anxiety and tension. It prevents me from working and sleeping normally. I am constantly worried about the future, and I can't concentrate on current affairs. What should I do?

Example response:

Hi! Thank you for sharing your feelings. Anxiety and tension can have various causes, and it's important to understand what exactly is causing these feelings in your case. Here are a few steps that might help improve your condition:

Identify triggers: Try to understand what situations or thoughts cause you the most anxiety. Write them down in a journal so you can analyze them.

Practice relaxation techniques: Meditation, breathing exercises, and yoga can help reduce stress and anxiety levels. Set aside at least 10-15 minutes daily for these practices.

Create a schedule: Plan your day so that you have clear time frames for work, rest, and sleep. Try to avoid overloading yourself with work.

Communication: Talking to friends or loved ones can help you feel supported and relieve emotional tension.

Healthy lifestyle: Maintain a healthy diet, avoid caffeine and alcohol, especially before bed. Healthy sleep is also an important factor in fighting anxiety.

I hope these tips help you feel better. Remember that over time and with the right approach, you can overcome these difficulties."`,
  },
  UA: {
    hi: "Привіт, я Психолог. Я можу допомогти тобі. Натисни кнопку 'Поділитися почуттями' зі мною.",
    help: `Ось доступні команди:
      /start - Почати взаємодію з ботом.
      /help - Показати це повідомлення допомоги.
      /language - Змінити мову бота.
Інші текстові повідомлення будуть оброблені та отримають відповідь від ІІ.`,
    selectLanguage: "Виберіть вашу мову:",
    share: "Поділитися почуттями",
    shareMore: "Поділитися почуттями ще",
    sorry:
      "Вибачте, я не можу продовжити розмову. Натисніть кнопку 'Поділитися почуттями' зі мною.",
    limit: "Досягнуто ліміт розмови. Будь ласка, спробуйте пізніше.",
    pleaseWait: "Будь ласка, зачекайте...",
    youCanShare:
      "Ви можете поділитися своїми почуттями зі мною на рідній мові.",
    prompt: `"Відповідайте так, ніби ви психолог, до якого люди описують свої проблеми. Використовуйте мову наступного повідомлення для вашої відповіді. Відповідь має бути якомога детальнішою з порадами щодо покращення стану.

Приклад запиту: Привіт. Останнім часом я відчуваю постійне занепокоєння та напругу. Це заважає мені нормально працювати та спати. Я постійно хвилююся про майбутнє і не можу зосередитися на поточних справах. Що мені робити?

Приклад відповіді:

Привіт! Дякую, що поділилися своїми почуттями. Занепокоєння та напруга можуть мати різні причини, і важливо зрозуміти, що саме викликає ці почуття у вашому випадку. Ось кілька кроків, які можуть допомогти покращити ваш стан:

Визначте тригери: Спробуйте зрозуміти, які ситуації чи думки викликають у вас найбільше занепокоєння. Запишіть їх у щоденник, щоб ви могли їх проаналізувати.

Практикуйте техніки розслаблення: Медитація, дихальні вправи та йога можуть допомогти знизити рівень стресу та тривоги. Виділяйте щодня хоча б 10-15 хвилин на ці практики.

Створіть розклад: Плануйте свій день так, щоб у вас були чіткі часові рамки для роботи, відпочинку та сну. Намагайтеся уникати перевантаження себе роботою.

Спілкування: Розмови з друзями чи близькими можуть допомогти вам відчути підтримку та зняти емоційну напругу.

Сподіваюся, ці поради допоможуть вам почуватися краще. Пам'ятайте, що з часом і правильним підходом ви зможете подолати ці труднощі."`,
  },
  selectedLanguage: (lang) => {
    switch (lang) {
      case "EN":
        return "Selected language: English";
      case "UA":
        return "Обрана мова: Українська";
      default:
        return "Selected language: Unknown";
    }
  },
};
