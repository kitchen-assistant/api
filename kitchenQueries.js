//initialize firebase
var config = {
	apikey: "",
	autoDomain: "",
	databaseURL: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: ""
};

firebase.initializeApp(config);
var firestore = firebase.firestore();


//queries specific document 
var usersRef = firestore.collection('users').doc("2mQJiD8oR2dvyqVJdW4O")

//checks if document exists, if it does, it acts as a SELECT *
var getDoc = usersRef.get()
    .then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', doc.data());
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });


//Insert data
var usersRef = db.collection('users');
var newUserPaul = usersRef.doc("uniqueID").set({
	firstName: "Paul", lastName: "Kwoyelo", email: "paul@test.com", grocery: {
		pretzels: {
			price: 1.99
		},
		rice : {
			price: 2.99
		}
	}, locations : {
		fridge: {
			beer: {
				expiration_date: 10/10/2020,
				food_group : "alcohol"
			}
		}
	}
})


//alternative inserts
var data = { firstName: "Paul", lastName: "Kwoyelo")};
var setDoc = db.collection('users').doc('uniqueID').set(data);

//alternative inserts -- auto generates unique ID
var usersRef = db.collection('users');
var newUserPaul = usersRef.add( { firstName: "Paul", lastName: "Kwoyelo"} );

//update non nested
var updatePaulDoc = db.collection('users').doc('uniqueID');
var updatePaulName = updatePaulDoc.update( {firstName: "Patrick"} );


//different data model - references grocery list in jeremeys user account
var groceryRef = db.collection('users').doc('helmIkM7LrZXY50XWdko').collection('location');


//data types
var data = {
    stringExample: 'Hello, World!',
    booleanExample: true,
    numberExample: 3.14159265,
    dateExample: new Date('December 10, 1815'),
    arrayExample: [5, true, 'hello'],
    nullExample: null,
    objectExample: {
        a: 5,
        b: true
    }
};

var setDoc = db.collection('data').doc('one').set(data);


