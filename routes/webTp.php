<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\Profile;
use App\Http\Controllers\Tp1;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;


// -	http://localhost /
// -	http://localhost /login
// -	http://localhost /page/1


// Route::get('/' , function(){
//     return "this is home page"  ;
// }) ;




// Route::get('/login' ,function(){
//     return "this is the login  page"  ;
// } )->name("login") ;


// Route::get('/page/{page}' , function(){
//     return "welcome to page {page}"  ;
// });



// // tested 

// Route::get('contact', function() {
// return "C'est moi le contact.";
// });


// Route::get('{n}', function($n) {
// return 'Je suis la page ' . $n . ' !';
// });

// // end 



//a/b show the pram in a paragraph 
Route::get('/test/{param}', function ($param) {
    return "the param value is  : " . $param;
});

//c send the param to the view 
Route::get('/viewTest/{param}', function ($param) {
    return view('welc', ["param" => $param]);
});





/*
4) Route Formation
*/

// create the route and return a string 
// route http://127.0.0.1:8000/Formation/developement/filiere/wfs/groupe/202/stagiaire/reda
Route::get(
    '/Formation/{formation}/filiere/{filiere}/groupe/{groupe}/stagiaire/{stagiaire}',
    function ($formation, $filiere, $groupe, $stagiaire) {
        return "Formation: $formation | Filiere: $filiere | Groupe: $groupe | Stagiaire: $stagiaire";
    }
);

// b) retourner une vue
// Route::get(
//     '/Formation/{formation}/filiere/{filiere}/groupe/{groupe}/stagiaire/{stagiaire}',
//     function ($formation, $filiere, $groupe, $stagiaire) {
//         return view('stg', compact(
//             'formation',
//             'filiere',
//             'groupe',
//             'stagiaire'
//         ));
//     }
// );

// c show the studen in view page
Route::get(
    '/Formation/{formation}/filiere/{filiere}/groupe/{groupe}/stagiaire/{stagiaire?}',
    function ($formation, $filiere, $groupe, $stagiaire = null) {

        $stagiaire = $stagiaire ?? date('Y');

         return view('stg', compact(
            'formation',
            'filiere',
            'groupe',
            'stagiaire'
        ));
    }
);



//ex 2

// 1.	Créer deux routes /profile avec les deux verbes http get et post :
// a.	get : permet d’afficher une vue comportant le formulaire suivant : 
//       <form action="{{ route('profile') }}" method="post">
//             {{ csrf_field() }}
//             <label for="nom">Nom</label>
//             <input type="text" name="nom" />
//             <label for="email">Email</label>
//             <input type="text" name="email" /><br>
//             <input type="submit" value="ok" />
//         </form>

// b.	post : permet de répondre aux soumissions du formulaire et d’afficher le nom et l’email indiqués par l’utilisateur ; Cette route doit être nommé ‘Profile’


Route::get('/profile' , [Profile::class  , 'index'] )->name('profile') ;
Route::post('/profile' , [Profile::class , 'store']) ;