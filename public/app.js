const auth = firebase.auth();

const whenSignedOut = document.getElementById("whenSignedOut");
const whenSignedIn = document.getElementById("whenSignedIn");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello, ${user.displayName}</h3>`;
    } else {
        // signed out
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = "";
    }
});

const db = firebase.firestore();
const thingsList = document.getElementById("thingsList");
const createThingBtn = document.getElementById("createThingBtn");

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
    if (user) {
        thingsRef = db.collection("things");

        createThingBtn.onclick = () => {
            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp(),
            });
        };

        unsubscribe = thingsRef
            .where("uid", "==", user.uid)
            .orderBy("createdAt")
            .onSnapshot((querySnapshot) => {
                const items = querySnapshot.docs.map((doc) => {
                    return `<li>${doc.data().name}</li>`;
                });
                thingsList.innerHTML = items.join("");
            });
    } else {
        unsubscribe && unsubscribe();
    }
});
