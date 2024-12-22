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
const auth_1 = require("firebase/auth");
const firebaseConfig_1 = __importDefault(require("../../../config/firebaseConfig"));
const auth = (0, auth_1.getAuth)(firebaseConfig_1.default);
const mapFirebaseUserToUser = (firebaseUser) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield firebaseUser.getIdToken();
    return {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        token,
    };
});
const FirebaseAuthService = {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCredential = yield (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
            return mapFirebaseUserToUser(userCredential.user);
        });
    },
    register(email, name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
            if (userCredential.user) {
                yield (0, auth_1.updateProfile)(userCredential.user, {
                    displayName: name,
                });
            }
            return mapFirebaseUserToUser(userCredential.user);
        });
    },
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, auth_1.signOut)(auth);
        });
    },
    onAuthStateChanged(callback) {
        return (0, auth_1.onAuthStateChanged)(auth, (firebaseUser) => __awaiter(this, void 0, void 0, function* () {
            if (firebaseUser) {
                const user = yield mapFirebaseUserToUser(firebaseUser);
                callback(user);
            }
            else {
                callback(null);
            }
        }));
    },
    loginWithGoogle() {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new auth_1.GoogleAuthProvider();
            const userCredential = yield (0, auth_1.signInWithPopup)(auth, provider);
            return mapFirebaseUserToUser(userCredential.user);
        });
    },
    resetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, auth_1.sendPasswordResetEmail)(auth, email);
        });
    },
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = auth.currentUser;
            if (!currentUser)
                return null;
            return currentUser.getIdToken();
        });
    },
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = auth.currentUser;
            if (!currentUser)
                return null;
            return currentUser.getIdToken(true);
        });
    },
};
exports.default = FirebaseAuthService;
