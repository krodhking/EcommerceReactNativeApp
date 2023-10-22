// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore,collection, getDocs, getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeAuth, getReactNativePersistence, onAuthStateChanged } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";

const firebaseConfig = {
  apiKey: "AIzaSyBtmUsVy9AMkTxrqoCVOUdtfnEM_tRGrAw",
  authDomain: "mafia-92fb4.firebaseapp.com",
  databaseURL: "https://mafia-92fb4-default-rtdb.firebaseio.com",
  projectId: "mafia-92fb4",
  storageBucket: "mafia-92fb4.appspot.com",
  messagingSenderId: "896058000507",
  appId: "1:896058000507:web:00efc1b3d736097cac0ede",
  measurementId: "G-0QYK1W95TY"
};

const app = initializeApp(firebaseConfig);
const fireStore = getFirestore(app);
const auth = getAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

  
async function getStoreFrontData(sellerId) {
    const storeFrontSnapshot = await getDocs(collection(fireStore, "storeFront"));
    const itemSnapshot = await getDocs(collection(fireStore, "item"));

    //GetFeatureCategories;
    var featuredCategories;
    var dpFeaturedCategories = [];
    storeFrontSnapshot.forEach((doc) => {
        if(doc.id == sellerId) {
            const data = doc.data();
            featuredCategories = data["featureCategories"];
        }
    });
    
    if(featuredCategories) {
        itemSnapshot.forEach((doc) => {
            for(i=0;i<featuredCategories.length;i++) {
                if(doc.id == featuredCategories[i]["sellerId"]) {
                    const itemDetails = doc.data()["itemDetails"];
                    for(j=0; j< itemDetails.length;j++) {
                        if(featuredCategories[i]["itemId"] == itemDetails[j]["id"]) {
                            dpFeaturedCategories.push(
                                {
                                    "name": itemDetails[i]["subCategory"],
                                    "imageUrl": itemDetails[i]["imageUrl"]
                                }
                            );
                        }
                    }
                }
            }
        });
    }

    //GetShopImages;
    var dpShopImages;
    storeFrontSnapshot.forEach((doc) => {
        if(doc.id == sellerId) {
            const data = doc.data();
            dpShopImages = data["shopImages"];
        }
    });
    
    //GetWeeklyDeal
    var dpWeeklyDeals = [];
    var weeklyDeals;
    storeFrontSnapshot.forEach((doc) => {
        if(doc.id == sellerId) {
            const data = doc.data();
            weeklyDeals = data["weeklyDeals"];
            itemSnapshot.forEach((item) => {
                const itemDetails = item.data()["itemDetails"];
                if(item.id == sellerId) {
                    itemDetails.forEach((itemDetail) => {
                        weeklyDeals.forEach((weeklyDeal) => {
                                if(itemDetail.id == weeklyDeal.itemId) {
                                dpWeeklyDeals.push({
                                    "itemId": weeklyDeal.itemId,
                                    "discount": weeklyDeal.discount,
                                    "imageUrl": itemDetail.imageUrl,
                                    "title": itemDetail.title
                                })
                            }
                        })
                    })
                }
            })
        }
    });

    //GetTodayDeal
    var dpTodayDeals = [];
    var todayDeals;
    storeFrontSnapshot.forEach((doc) => {
        if(doc.id == sellerId) {
            const data = doc.data();
            todayDeals = data["todayDeals"];
            itemSnapshot.forEach((item) => {
                const itemDetails = item.data()["itemDetails"];
                if(item.id == sellerId) {             
                    itemDetails.forEach((itemDetail) => {
                        todayDeals.forEach((todayDeal) => {
                                if(itemDetail.id == todayDeal.itemId) {
                                dpTodayDeals.push({
                                    "itemId": todayDeal.itemId,
                                    "discount": todayDeal.discount,
                                    "imageUrl": itemDetail.imageUrl,
                                    "title": itemDetail.title,
                                    "price": itemDetail.price
                                })
                            }
                        })
                    })
                }
            })
        }
    });

    //GetItemsWithSubCategory
    subCategoryToItemsMap = {};
    itemSnapshot.forEach((doc) => {
        if(doc.id == sellerId) {
            const itemDetails = doc.data()["itemDetails"];
            itemDetails.forEach((itemDetail) => {
                if(subCategoryToItemsMap.hasOwnProperty(itemDetail.subCategory)) {
                    subCategoryToItemsMap[itemDetail.subCategory].push(itemDetail);
                    subCategoryToItemsMap[itemDetail.subCategory].push(itemDetail);
                    subCategoryToItemsMap[itemDetail.subCategory].push(itemDetail);
                    subCategoryToItemsMap[itemDetail.subCategory].push(itemDetail);

                } else {
                    subCategoryToItemsMap[itemDetail.subCategory] = [itemDetail];
                    subCategoryToItemsMap[itemDetail.subCategory].push(itemDetail);
                    subCategoryToItemsMap[itemDetail.subCategory].push(itemDetail);
                    subCategoryToItemsMap[itemDetail.subCategory].push(itemDetail);
                }
            });
        }
    })

    return {
        "featuredCategories": dpFeaturedCategories,
        "shopImages": dpShopImages,
        "weeklyDeals": dpWeeklyDeals,
        "todayDeals": dpTodayDeals,
        "subCategoryToItemsMap" : subCategoryToItemsMap
    };
}

async function fireBaseCreateUserWithEmailAndPassword(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                //Register on auth state changed. 
                console.log("Create user with email and password");
                console.log(`Email: ${email}, Password: ${password}`);
            }).catch(error => {
                console.log("got error in fireBaseCreateUserWithEmailAndPassword")
                console.log(error);
            })
}

async function fireBaseSignInWithEmailAndPassword(email, password) {
    return await signInWithEmailAndPassword(auth, email, password)
    .then((response) => {
        console.log("User is signed in" + email + password);

    }).catch(error => {
        console.log(error);
    })
}

async function addAddress(userId, address) {
    docSnap = await getDoc(doc(collection(fireStore, "userProfile"), userId));
    const data = docSnap.data();
    data.userInfo.addresses.push(address);
    await updateDoc(doc(collection(fireStore, "userProfile"), userId), data)
}

async function getAddress(userId) {
    docSnap = await getDoc(doc(collection(fireStore, "userProfile"), userId));
    const data = docSnap.data();
    return data.userInfo.addresses;
}





export {getStoreFrontData, fireBaseCreateUserWithEmailAndPassword,
     fireBaseSignInWithEmailAndPassword, auth, addAddress, getAddress};