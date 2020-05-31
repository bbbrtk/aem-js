"use strict";
const fs = require('fs');

export const vertexSimilarity = function getVertexSimilarity(arr1, arr2){
    let similarity = 0;
    arr1.forEach(element => {
        if (arr2.includes(element)) similarity++;
    });
    return similarity;
}

export const edgeArray = function createEdgeArray(arr1){
    let edges = [];
    arr1.forEach((elem, index) => {
        if (index == arr1.length-1) index = -1;
        edges.push(
            new Set([elem, arr1[index+1]])
            )
    });
    return edges;
}


export const loadData = function loadDataFromFile(filename){
    if (fs.lstatSync(filename).isFile()) {
        return fs.readFileSync(filename, 'utf-8');
    }
}

export const toArray = function convertDataToArray(filename){
    let buffer = loadData(filename);
    return [...buffer];
}

function convertBufferToNumberArray(content){
    let number = '';
    let arr = [];
    content.forEach(element => {
        if (element == '\n') {
            arr.push(parseInt(number, 10)); 
            number = '';
        }
        else number += element;
    });
    return arr;
}

function convertBufferToAnArray(content){
    let number = '';
    let mainArr = [];
    let arr = [];
    content.forEach(element => {
        if (!isNaN(parseInt(element))){
            number += element;
        } else {
            if (element == ',') {
                arr.push(parseInt(number, 10)); 
                number = '';
            }
            if (element == '\n') {
                mainArr.push(arr); 
                arr = [];
            }
        }
    });
    return mainArr;
}


export const loadAllFiles = function loadDataFromAllFiles(){
    let arr = [];
    const path = 'data/';
    const lens = [
        'lensA.txt',
        'lensB.txt'
    ];
    const paths = [
        'pathsA.txt',
        'pathsB.txt'
    ];
    
    lens.forEach(element => {
        let content = toArray(path + element);
        arr.push(convertBufferToNumberArray(content));
    });
    paths.forEach(element => {
        let content = toArray(path + element);
        arr.push(convertBufferToAnArray(content));
    });
    return arr;
}

