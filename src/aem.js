"use strict";
const fs = require('fs');
const _ = require("lodash");
const plotly = require('plotly')("bartoszsobkowiak", "kVLzvjQKm8CvgUGuU9A2");


const path = 'data/';

function pearsonCorrelation(prefs, p1, p2) {
    var si = [];
  
    for (var key in prefs[p1]) {
      if (prefs[p2][key]) si.push(key);
    }
  
    var n = si.length;
  
    if (n == 0) return 0;
  
    var sum1 = 0;
    for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];
  
    var sum2 = 0;
    for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];
  
    var sum1Sq = 0;
    for (var i = 0; i < si.length; i++) {
      sum1Sq += Math.pow(prefs[p1][si[i]], 2);
    }
  
    var sum2Sq = 0;
    for (var i = 0; i < si.length; i++) {
      sum2Sq += Math.pow(prefs[p2][si[i]], 2);
    }
  
    var pSum = 0;
    for (var i = 0; i < si.length; i++) {
      pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
    }
  
    var num = pSum - (sum1 * sum2 / n);
    var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
        (sum2Sq - Math.pow(sum2, 2) / n));
  
    if (den == 0) return 0;
  
    return num / den;
  }

 const vertexSimilarity = function(arr1, arr2){
    let similarity = 0;
    arr1.forEach(element => {
        if (arr2.includes(element)) similarity++;
    });
    return similarity;
}

 const edgeArray = function(arr1){
    let edges = [];
    arr1.forEach((elem, index) => {
        if (index == arr1.length-1) index = -1;
        edges.push(
            new Set([elem, arr1[index+1]])
            )
    });
    return edges;
}

 const edgeSimilarity = function(arr1, arr2){
    let similarity = 0;
    arr1.forEach(elem1 => {
        arr2.forEach(elem2 => {
            if (_.isEqual(elem1, elem2)) similarity++;
        });
    });
    return similarity;
}

 const loadData = function(filename){
    if (fs.lstatSync(filename).isFile()) {
        return fs.readFileSync(filename, 'utf-8');
    }
}

 const toArray = function(filename){
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

 const loadAllFiles = function(){
    let arr = [];
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

 const findMinAvg = function(arr){
    let avg = _.reduce(arr, (sum, elem) => {return sum + elem}, 0) / arr.length;
    let min = Math.min(...arr);
    return [min, avg];
}

 const calcAvgSimilarityToAll = function(values, paths, func){
    let similarities = []

    paths.forEach((elem1, index) => {
        let similarity = -paths.length; // to not include similarity with itself when calculating avg
        paths.forEach(elem2 => {
            similarity += func(elem1, elem2);
        });
        similarities.push({
            'value' : values[index], 
            'similarity' : similarity/(paths.length-1)
        });
    });
    similarities.sort((a, b) => {
        return a.value - b.value;
      });
    return similarities;
}

 const calcSimilarityToBest = function(values, paths, func, best){
    let similarities = []

    paths.forEach((elem1, index) => {
        similarities.push({
            'value' : values[index], 
            'similarity' : func(elem1, best)
        });
    });
    similarities.sort((a, b) => {
        return a.value - b.value;
      });
    return similarities;
}

 const calcAllSimilarities = function(values, paths, best){
    let vertexSim = calcAvgSimilarityToAll(values, paths, vertexSimilarity);
    // let vertexSim = [];
    let vertexSimBest = calcSimilarityToBest(values, paths, vertexSimilarity, best);
    let edges = [];
    paths.forEach(elem1 => {
        edges.push(edgeArray(elem1));
    });   
    let edgeSim = calcAvgSimilarityToAll(values, edges, edgeSimilarity);
    // let edgeSim = [];
    let edgeSimBest = calcSimilarityToBest(values, edges, edgeSimilarity, edgeArray(best));

    return [vertexSim, vertexSimBest, edgeSim, edgeSimBest];
}

const drawPlot = function(arr, name){
    var data = [{
        x: arr.map(elem => elem.value),
        y: arr.map(elem => elem.similarity),
        mode: "markers",
        type: "scatter"
    }];
    
    var layout = {fileopt : "overwrite", filename : name};
    
    plotly.plot(data, layout, function (err, msg) {
        if (err) return console.log(err);
        console.log(msg);
    });
}


let files = loadAllFiles();
[0, 1].forEach(elem => {
    let bestIndex = files[elem].findIndex( x => x == findMinAvg(files[elem])[0] );
    let arr = calcAllSimilarities(files[elem], files[elem+2], files[elem+2][bestIndex]);
    let names = ["vertexSim", "vertexSimBest", "edgeSim", "edgeSimBest"];
    arr.forEach((elem2, index) => {
        // plot
        drawPlot(elem2, names[index]+elem.toString());
        // corr
        let data = new Array(
            elem2.map(elem => elem.value),
            elem2.map(elem => elem.similarity)
            );
        if (data.length > 0){
            let corr = pearsonCorrelation(data,0,1);
            console.log(corr);
        } 

    });
});

