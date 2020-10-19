// CODE JS
console.log("hello, tout fonctionne");
class App {
  constructor() {
    this.setup();
  }

  setup() {
    const urlParameter = new URLSearchParams(window.location.search);
    this.ID = urlParameter.get("nom");

    this.chat = document.getElementById("chat");
    this.chat.addEventListener("keydown", this.onKeyDown.bind(this));
    this.conversation = document.getElementById("conversation");
    this.conversation.addEventListener("click", this.onClick.bind(this));
    this.dict = {};
    //FB
    //listener
    DATABASE.ref("GAEL/CHAT/MESSAGES").on("value", (snapshot) => {
      const allMessages = snapshot.val();
      try {
        if (allMessages) {
          const keyArray = Object.keys(allMessages);
          // ON FAIT UNE COPIE DE TOUS LES MESSAGES RECU
          // ET LORSQU'ON VA COMPARER TOUS LES NOUVEAUS MESSAGES AVEC LE DICTIONNAIRE
          // ON SUPPRIME L'ELEMENT DANS LA COPIE.
          // -> S'IL EN RESTE APRES LA BOUCLE, CE SONT DES MESSAGES à SUPPRIMER
          const copy = Object.assign({}, this.dict);

          for (const key of keyArray) {
            if (!this.dict[key]) {
              // console.log(allMessages[key]);
              const id = allMessages[key].id;
              const message = allMessages[key].message;
              const div = document.createElement("div");
              div.id = key;
              div.className = id != this.ID ? "left" : "right";
              div.classList.add("message");
              div.innerHTML =
                message == "***---***"
                  ? '<div class="small_bubble"><p class="saving"><span>.</span><span>.</span><span>.</span></p></div>'
                  : '<div class="small_bubble">' + message + "</div>";

              div.setAttribute("data-id", id);
              div.setAttribute("data-timestamp", key);
              this.dict[key] = key;
              if (message == "***---***" && this.ID == id) {
                //
              } else {
                this.conversation.appendChild(div);
              }
            }
            //ON EFFACE L'ELEMENT DE LA COPIE
            delete copy[key];
          }

          // ON VERIFIE S'IL RESTE UN OU PLUSIEURS ELEMENTS DANS LA COPIE
          // S'IL EN RESTE, ON DOIT LES DISSIMULER

          //la boucle de suppression
          const elementsASupprimer = Object.keys(copy);
          for (const k of elementsASupprimer) {
            const id = copy[k];
            const div = document.getElementById(id);
            if (div) div.classList.add("hidden");
          }

          this.conversation.scrollTop = this.conversation.scrollHeight;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  onKeyDown(e) {
    if (e.key == "Enter") {
      //console.log("Enter est clické");
      const message = {
        message: this.chat.value,
        id: this.ID,
      };
      const timing = new Date().getTime();
      //console.log(timing);
      SEND_MESSAGE("GAEL/CHAT/MESSAGES/" + this.loaderTiming, null);
      SEND_MESSAGE("GAEL/CHAT/MESSAGES/" + timing, message);
      this.chat.value = "";
      this.loader = false;
    } else {
      if (!this.loader) {
        this.loader = true;
        const message = {
          message: "***---***",
          id: this.ID,
        };
        this.loaderTiming = new Date().getTime();
        //console.log(timing);
        SEND_MESSAGE("GAEL/CHAT/MESSAGES/" + this.loaderTiming, message);
      }
    }
  }

  onClick(e) {
    console.log(e.target);

    if (e.target.id != "conversation") {
      const id = e.target.getAttribute("data-id");
      const timestamp = e.target.getAttribute("data-timestamp");
      if (id != this.ID) {
        alert("on ne peut pas effacer la bulle des autres !");
      } else {
        console.log("EFFACER DE FIREBASE");
        SEND_MESSAGE("GAEL/CHAT/MESSAGES/" + timestamp, null);
        e.target.classList.add("hidden");
      }
    } else {
      alert("il faut clickquer sur une bulle !");
    }
  }
}

window.onload = () => {
  new App();
};
