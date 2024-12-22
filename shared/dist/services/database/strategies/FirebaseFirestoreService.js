"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase/firestore");
const firebaseConfig_1 = __importDefault(require("../../../config/firebaseConfig"));
const db = (0, firestore_1.getFirestore)(firebaseConfig_1.default);
const FirebaseDatabaseService = {
    addDocument(collectionPath, data, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const safeData = data;
                const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(db, collectionPath), safeData);
                if (onSuccess)
                    onSuccess(docRef.id);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    },
    getDocument(collectionPath, docId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(db, collectionPath, docId);
                const docSnap = yield (0, firestore_1.getDoc)(docRef);
                if (docSnap.exists()) {
                    if (onSuccess)
                        onSuccess(docSnap.data());
                }
                else if (onSuccess)
                    onSuccess(null);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    },
    updateDocument(collectionPath, docId, data, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(db, collectionPath, docId);
                yield (0, firestore_1.setDoc)(docRef, data, { merge: true });
                if (onSuccess)
                    onSuccess();
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    },
    deleteDocument(collectionPath, docId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(db, collectionPath, docId);
                yield (0, firestore_1.deleteDoc)(docRef);
                if (onSuccess)
                    onSuccess();
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    },
    listenToDocument(collectionPath, docId, onUpdate, onError) {
        const documentRef = (0, firestore_1.doc)(db, collectionPath, docId);
        return (0, firestore_1.onSnapshot)(documentRef, (newDoc) => {
            if (newDoc.exists()) {
                onUpdate(newDoc.data());
            }
        }, onError);
    },
    getNewDocumentID(collectionName, onSuccess, onFailure) {
        try {
            const newDocRef = (0, firestore_1.doc)((0, firestore_1.collection)(db, collectionName));
            if (onSuccess)
                onSuccess(newDocRef.id);
            return Promise.resolve(newDocRef.id);
        }
        catch (error) {
            if (onFailure)
                onFailure(error);
            return Promise.reject(error);
        }
    },
    queryDocumentById(collectionPath, docId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(db, collectionPath, docId);
                const docSnapshot = yield (0, firestore_1.getDoc)(docRef);
                if (docSnapshot.exists()) {
                    const document = Object.assign(Object.assign({}, docSnapshot.data()), { id: docSnapshot.id });
                    if (onSuccess)
                        onSuccess(document);
                }
                else {
                    throw new Error('Document not found');
                }
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    },
    queryDocuments(collectionPath, queryField, orderByField, queryValue, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const q = (0, firestore_1.query)((0, firestore_1.collection)(db, collectionPath), (0, firestore_1.where)(queryField, '==', queryValue), (0, firestore_1.orderBy)(orderByField));
                const querySnapshot = yield (0, firestore_1.getDocs)(q);
                const documents = [];
                querySnapshot.forEach((queryDoc) => {
                    const data = queryDoc.data();
                    const result = Object.assign(Object.assign({}, data), { id: queryDoc.id });
                    documents.push(result);
                });
                if (onSuccess)
                    onSuccess(documents);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    },
    getRandomDocument(collectionPath, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const q = (0, firestore_1.query)((0, firestore_1.collection)(db, collectionPath));
                const querySnapshot = yield (0, firestore_1.getDocs)(q);
                const documents = [];
                querySnapshot.forEach((queryDoc) => {
                    const data = queryDoc.data();
                    const result = Object.assign(Object.assign({}, data), { id: queryDoc.id });
                    documents.push(result);
                });
                if (documents.length > 0) {
                    const randomIndex = Math.floor(Math.random() * documents.length);
                    const randomDocument = documents[randomIndex];
                    if (onSuccess)
                        onSuccess(randomDocument);
                }
                else if (onSuccess) {
                    onSuccess(null); // No documents found
                }
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    },
    getAllDocuments(collectionPath, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collectionRef = (0, firestore_1.collection)(db, collectionPath);
                const querySnapshot = yield (0, firestore_1.getDocs)(collectionRef);
                const documents = [];
                querySnapshot.forEach((queryDoc) => {
                    const data = queryDoc.data();
                    const result = Object.assign(Object.assign({}, data), { id: queryDoc.id });
                    documents.push(result);
                });
                if (onSuccess)
                    onSuccess(documents);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    },
    listenToQuery(collectionPath, queryField, queryValue, orderByField, onUpdate, onError = (err) => { console.error(err.message); }) {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(db, collectionPath), (0, firestore_1.where)(queryField, '==', queryValue), (0, firestore_1.orderBy)(orderByField));
        return (0, firestore_1.onSnapshot)(q, (querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((queryDoc) => {
                const data = queryDoc.data();
                const result = Object.assign(Object.assign({}, data), { id: queryDoc.id });
                documents.push(result);
            });
            onUpdate(documents);
        }, onError);
    },
    complexQuery(collectionPath, filters, orderByFields, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collectionRef = (0, firestore_1.collection)(db, collectionPath);
                // Start building the query
                let q = (0, firestore_1.query)(collectionRef);
                // Apply all filter conditions
                filters.forEach((filter) => {
                    q = (0, firestore_1.query)(q, (0, firestore_1.where)(filter.field, filter.operator, filter.value));
                });
                // Apply all orderBy clauses
                if (orderByFields) {
                    orderByFields.forEach((orderByField) => {
                        q = (0, firestore_1.query)(q, (0, firestore_1.orderBy)(orderByField.field, orderByField.direction));
                    });
                }
                const querySnapshot = yield (0, firestore_1.getDocs)(q);
                const documents = [];
                querySnapshot.forEach((queryDoc) => {
                    const data = queryDoc.data();
                    const result = Object.assign(Object.assign({}, data), { id: queryDoc.id });
                    documents.push(result);
                });
                if (onSuccess)
                    onSuccess(documents);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    },
};
exports.default = FirebaseDatabaseService;
