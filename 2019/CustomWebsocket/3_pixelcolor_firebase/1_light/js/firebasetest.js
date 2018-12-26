//La fonction user pour définir qui est qui !
//Il faut avoir une variable globale (var = player;)
//A la fin du setup il faut appeller :
//-	user();
//- 	listen();
function user() {
database.ref('USER').on(
    'value', (function(snapshot) {
   if ((snapshot.val() == null || snapshot.val().data == 2 || snapshot.val().data == 3) && player == null) {
        // initialise le joueur 1
        console.log('YOU ARE PLAYER 1');
       player = 1;
       send('USER', 1);
   } else if (snapshot.val().data == 1 && player == null) {
       //initialise le joueur 1
       console.log('YOU ARE PLAYER 2');
       player = 2;
       send('USER', 2);
   }
    }));
}


//La fonction qui permet d’écouter les changements de la base de donnée.

function listen() {
	//changement dans l’entrée POS de la db
    database.ref("POS").on('value', function(snapshot) {
   if (snapshot.val()) {
       var datas = snapshot.val().data;

       if (player != datas.player) {
                console.log(datas);
       }
   }
    });
}

//La fonction send envoie les données sur la db ! attention, les données doivent être sous forme de JSON.

function send(path, _data) {
var json = {'data' : _data};
database.ref(path).set(json);
}

//Comme ça par exemple :

    send('SIZE-Mobile', {
        'x' : w,
        'y' : h,
        'dpi' : dpi,
        'rayon' : rayonBalle,
        'longeur' : longeur
    });

//Ou sous cette forme : 

send('USER', 2);

