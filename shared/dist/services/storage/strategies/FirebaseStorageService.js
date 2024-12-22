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
// Assuming you have initialized Firebase in a similar manner
const storage_1 = require("firebase/storage");
const firebaseConfig_1 = __importDefault(require("../../../config/firebaseConfig"));
const storage = (0, storage_1.getStorage)(firebaseConfig_1.default);
const FirebaseStorageService = {
    uploadFile(path, file, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageRef = (0, storage_1.ref)(storage, path);
            const uploadTask = (0, storage_1.uploadBytesResumable)(storageRef, file);
            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress)
                        onProgress(progress);
                }, (error) => {
                    console.log('Failed to upload');
                    reject(error);
                }, () => {
                    // Handle successful uploads on complete
                    (0, storage_1.getDownloadURL)(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('Uploaded', downloadURL);
                        resolve(downloadURL);
                        return downloadURL;
                    });
                });
            });
        });
    },
    downloadFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!path) {
                throw new Error('Invalid file path.');
            }
            const storageRef = (0, storage_1.ref)(storage, path);
            return (0, storage_1.getDownloadURL)(storageRef)
                .then((url) => fetch(url))
                .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.blob();
            })
                .catch((error) => {
                console.error('Failed to download file:', error);
                throw error;
            });
        });
    },
    getDownloadURL(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!path) {
                throw new Error('Path cannot be empty');
            }
            const storageRef = (0, storage_1.ref)(storage, path);
            return (0, storage_1.getDownloadURL)(storageRef)
                .then((downloadURL) => {
                console.log('URL retrieved:', downloadURL);
                return downloadURL;
            })
                .catch((error) => {
                console.error('Error fetching download URL:', error);
                throw error;
            });
        });
    },
    deleteFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageRef = (0, storage_1.ref)(storage, path);
            (0, storage_1.deleteObject)(storageRef).then(() => {
                console.log('File deleted successfully');
            }).catch((err) => {
                console.log(`failed ${err}`);
            });
        });
    },
};
exports.default = FirebaseStorageService;
