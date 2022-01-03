import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ToastAndroid } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { imageServices } from '../services/image_upload/image.services';

export default function UploadImage() {
    const [image, setImage] = useState(null);
    const [uploadedImgResponse, setUploadedImgResponse] = useState(null)
    const [loader, setLoader] = useState(false)

    /** Retrieve & upload images from gallery. 
    * @imageFromGallery
    */
    const imageFromGallery = async () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            multiple: false,
        }).then(async (images) => {
            var imgResponse = {
                path: images.path,
                mime: images.mime,
            };
            // Set image response
            setImage(imgResponse)
            await setLoader(true)
            let formData = new FormData();
            formData.append("image", JSON.parse(JSON.stringify({
                uri: imgResponse.path,
                name: new Date().getTime().toString() + (imgResponse.mime).substr((imgResponse.mime).indexOf('/') + 1),
                type: imgResponse.mime
            })));
            // upload image
            var response = await imageServices.uploadImage(formData)
            if (response?.resp) {
                setUploadedImgResponse(response.link)
            } else {
                ToastAndroid.show("Error in uploading Image", ToastAndroid.LONG)
            }
            setUploadedImgResponse(response.link)
            await setLoader(false)

        }).catch((e) => {
            console.log("No Image Selected " + e)
            setLoader(false)
        });
    }

    return (
        <View style={imageUploaderStyles.mainContainer}>
            <View style={imageUploaderStyles.container}>
                {image && <Image resizeMode={"stretch"} source={{ uri: image.path }} style={{ flex: 1 }} />}
                <View style={imageUploaderStyles.uploadBtnContainer}>
                    <TouchableOpacity onPress={imageFromGallery} style={imageUploaderStyles.uploadBtn} >
                        <Text style={imageUploaderStyles.text}>{image ? 'Change' : 'Choose'} Image</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginTop: 15, height: 400, width: "83%", alignSelf: "center", borderColor: "grey", borderWidth: uploadedImgResponse && 0.3 }}>
                {uploadedImgResponse && <Image resizeMode={"stretch"} source={{ uri: uploadedImgResponse.link }} style={{ flex: 1 }} />}
            </View>
            {uploadedImgResponse && <Text style={imageUploaderStyles.uplodedTxt}>Uploaded Image</Text>}
            {loader && <ActivityIndicator size="large" color="black" style={imageUploaderStyles.loaderStyle} />}
        </View>

    );
}

const imageUploaderStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        elevation: 2,
        height: 200,
        width: 200,
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: '#efefef',
        position: 'relative',
        borderRadius: 999,
        overflow: 'hidden',
        marginTop: 20
    },
    uploadBtnContainer: {
        opacity: 0.7,
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'grey',
        width: '100%',
        height: '25%',
    },
    uploadBtn: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center',
    },
    text: {
        alignSelf: "center",
        textAlignVertical: "center",
        marginTop: 15,
        color: 'white',
        fontWeight: "bold"
    },
    uplodedTxt: {
        color: "black",
        alignSelf: "center",
        marginTop: 5,
        fontSize: 15,
        fontWeight: "bold"
    },
    loaderStyle: {
        justifyContent: "center",
        alignSelf: "center",
        position: "absolute",
        width: "100%",

    }
})