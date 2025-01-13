const datas = [
  {
    id: "1",
    token: [],
    name: "Moise",
    email: "moise@gmail.com",
    password: "qwerty",
    conversations: [
      {
        id: "conv_001",
        date: "2024-12-19T10:03:00Z",
        isOnline: true,
        status: "vu", // La conversation a été vue
        writing: false, // L'autre personne n'écrit pas
        otherPerson: {
          id: "2bd34s7q",
          name: "Jean",
        },
        messages: [
          {
            isSender: false,
            text: "salut c'est moi",
            sender: {
              id: "2bd34s7q",
              name: "Jean",
            },
            date: "2024-12-19T10:00:00Z",
            status: "vu", // Message vu
          },
          {
            isSender: true,
            text: "salut c'est moi",
            sender: {
              id: "1yf22u2i",
              name: "Ekanga",
            },
            date: "2024-12-19T10:01:00Z",
            status: "envoye", // Message envoyé
          },
          {
            isSender: false,
            text: "salut c'est moi",
            sender: {
              id: "2bd34s7q",
              name: "Jean",
            },
            date: "2024-12-19T10:02:00Z",
            status: "vu", // Message vu
          },
          {
            isSender: true,
            text: "hey l'ami",
            sender: {
              id: "1yf22u2i",
              name: "Ekanga",
            },
            date: "2024-12-19T10:03:00Z",
            status: "envoye", // Message envoyé
          },
        ],
        lastMessage: {
          text: "hey l'ami",
          date: "2024-12-19T10:03:00Z",
          status: "vu", // Dernier message vu
        },
      },
      {
        id: "conv_002",
        date: "2024-12-19T09:53:00Z",
        isOnline: true,
        status: "envoye", // La conversation n'a pas encore été vue
        writing: true, // L'autre personne est en train d'écrire
        otherPerson: {
          id: "3xy89pz1",
          name: "Alice",
        },
        messages: [
          {
            isSender: true,
            text: "ça roule et toi ?",
            sender: {
              id: "1yf22u2i",
              name: "Ekanga",
            },
            date: "2024-12-19T09:50:00Z",
            status: "envoye", // Message envoyé
          },
          {
            isSender: false,
            text: "salut c'est moi",
            sender: {
              id: "3xy89pz1",
              name: "Alice",
            },
            date: "2024-12-19T09:51:00Z",
            status: "vu", // Message vu
          },
          {
            isSender: false,
            text: "salut c'est moi",
            sender: {
              id: "3xy89pz1",
              name: "Alice",
            },
            date: "2024-12-19T09:52:00Z",
            status: "vu", // Message vu
          },
          {
            isSender: false,
            text: "salut c'est moi",
            sender: {
              id: "3xy89pz1",
              name: "Alice",
            },
            date: "2024-12-19T09:53:00Z",
            status: "vu", // Message vu
          },
        ],
        lastMessage: {
          text: "salut c'est moi",
          date: "2024-12-19T09:53:00Z",
          status: "vu", // Dernier message vu
        },
      },
      {
        id: "conv_003",
        date: "2024-12-19T08:33:00Z",
        isOnline: true,
        status: "envoye",
        writing: false,
        otherPerson: {
          id: "4jk57cd8",
          name: "Karim",
        },
        messages: [
          {
            isSender: false,
            text: "salut c'est moi",
            sender: {
              id: "4jk57cd8",
              name: "Karim",
            },
            date: "2024-12-19T08:30:00Z",
            status: "envoye", // Message envoyé
          },
          {
            isSender: false,
            text: "salut c'est moi",
            sender: {
              id: "4jk57cd8",
              name: "Karim",
            },
            date: "2024-12-19T08:31:00Z",
            status: "envoye", // Message envoyé
          },
          {
            isSender: false,
            text: "salut c'est moi",
            sender: {
              id: "4jk57cd8",
              name: "Karim",
            },
            date: "2024-12-19T08:32:00Z",
            status: "envoye", // Message envoyé
          },
          {
            isSender: false,
            text: "salut c'est moi",
            sender: {
              id: "4jk57cd8",
              name: "Karim",
            },
            date: "2024-12-19T08:33:00Z",
            status: "envoye", // Message envoyé
          },
        ],
        lastMessage: {
          text: "salut c'est moi",
          date: "2024-12-19T08:33:00Z",
          status: "envoye", // Dernier message envoyé
        },
      },
      {
        id: "conv_004",
        date: "2024-12-19T07:48:00Z",
        isOnline: false,
        status: "vu",
        writing: true,
        otherPerson: {
          id: "5lo98mn6",
          name: "Fatima",
        },
        messages: [
          {
            isSender: true,
            text: "repond moi !!",
            sender: {
              id: "1yf22u2i",
              name: "Ekanga",
            },
            date: "2024-12-19T07:45:00Z",
            status: "envoye", // Message envoyé
          },
          {
            isSender: true,
            text: "repond moi !!",
            sender: {
              id: "1yf22u2i",
              name: "Ekanga",
            },
            date: "2024-12-19T07:46:00Z",
            status: "envoye", // Message envoyé
          },
          {
            isSender: true,
            text: "repond moi !!",
            sender: {
              id: "1yf22u2i",
              name: "Ekanga",
            },
            date: "2024-12-19T07:47:00Z",
            status: "envoye", // Message envoyé
          },
          {
            isSender: true,
            text: "repond moi !!",
            sender: {
              id: "1yf22u2i",
              name: "Ekanga",
            },
            date: "2024-12-19T07:48:00Z",
            status: "envoye", // Message envoyé
          },
        ],
        lastMessage: {
          text: "repond moi !!",
          date: "2024-12-19T07:48:00Z",
          status: "envoye", // Dernier message envoyé
        },
      },
    ],
  },
];

module.exports = datas;
