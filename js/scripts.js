//CUMULATIVE TREND, X AND Y ARE SWITCHED FROM SCATTER PLOT

var reader; //GLOBAL File Reader object for demo purpose only
var dataSum = 0;
var coordinates = [{}];
/**
    * Check for the various File API support.
 */
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    reader = new FileReader();
    return true; 
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}
/**
    * read text input and populate it into an array
*/
function readText(filePath) {
    var output = ""; //placeholder for text output
    var stringArray = new Array();
    var yVals = new Array();
    if(filePath.files && filePath.files[0]) {           
        reader.onload = function (e) {
            output = e.target.result;
            cleanOutput = output.replace(/\s+/g,"").replace(/\./g," ").replace(/\s+$/, ""); //remove unnecessary whitespace, period, and then remove space from end of string
            stringArray = cleanOutput.split(" ");
            stringArray.pop();
            //for 100% of data
            for(i = 0; i < stringArray.length; i++) { //loop through array, convert each element to an integer, then add to yVals
                x = parseInt(stringArray[i], 10); //convert each number
                dataSum += x;
                yVals[i] = x;
            }
            populateDataset(dataSum, yVals);
			if(document.getElementById('scatter').checked) {
                document.getElementById("full-data-graph").innerHTML = "";
                scatterChart(100);
            }
            if(document.getElementById('time-series').checked) {
                document.getElementById("full-data-graph").innerHTML = "";
                timeSeries(100);
            }
            if(document.getElementById('arithmetic').checked) {
                document.getElementById("full-data-graph").innerHTML = "";
                arithmeticTrend(100);
            }
            if(document.getElementById('histogram').checked) {
                document.getElementById("full-data-graph").innerHTML = "";
                histogram(100);
            }
            if(document.getElementById('cumulative').checked) {
                document.getElementById("full-data-graph").innerHTML = "";
                cumulative(100);
            }
            //for 30% of data
            dataSum = 0; //reset data sum for new data
            dataSet.length = 0; //reset dataSet array for new data
            yVals.length = 0; //reset yVals array for new data
            limit = Math.floor(stringArray.length * .3); //set limit to 30% of values from file data
            for(i = 0; i < limit; i++) { //loop through array, convert each element to an integer, then add to yVals
                x = parseInt(stringArray[i], 10); //convert each number
                dataSum += x;
                yVals[i] = x;
            }
            populateDataset(dataSum, yVals);
            if(document.getElementById('scatter').checked) {
                document.getElementById("partial-data-graph").innerHTML = "";
                scatterChart(30);
            }
            if(document.getElementById('time-series').checked) {
                document.getElementById("partial-data-graph").innerHTML = "";
                timeSeries(30);
            }
            if(document.getElementById('arithmetic').checked) {
                document.getElementById("partial-data-graph").innerHTML = "";
                arithmeticTrend(30);
            }
            if(document.getElementById('histogram').checked) {
                document.getElementById("partial-data-graph").innerHTML = "";
                histogram(30);
            }
            if(document.getElementById('cumulative').checked) {
                document.getElementById("partial-data-graph").innerHTML = "";
                cumulative(30);
            }
            // if(document.getElementById('time-series').checked) {
            //     document.getElementById("full-data-graph").innerHTML = "";
            //     timeSeries(30);
            // }
        };//end onload()
        reader.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else if(ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            reader = new ActiveXObject("Scripting.FileSystemObject");
            var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            cleanOutput = output.replace(/\s+/g, '') //remove whitespace from string 
            console.log(cleanOutput);
            file.Close(); //close file "input stream"
            //displayContents(output);
         }
         catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' + 
                    'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
                    'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
            }
         }       
    }
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }       
    return true;
}   
/**
    * display content using a basic HTML replacement
*/
function displayContents(txt) {
    var el = document.getElementById('main'); 
    el.innerHTML = txt; //display output in DOM
}
/**
    * Get X values for dataset (calculated by taking Y value and dividing it by total sum of all y values)
    * add X and Y values to new array, which will be used to create graphs
*/
function populateDataset(sum, array) {
    xArray = [];
    for(i = 0; i < array.length; i++) {        
        xVal = array[i] / sum;
        xArray.push(xVal);
    }
    coordinates = [{
        xCoordinates: xArray,
        yCoordinates: array
    }];
    //console.log("coordinates object (y coordinates array): " + coordinates.yCoordinates);
    //console.log(coordinates[0].xCoordinates);
    //console.log(coordinates[0].yCoordinates);
}
function scatterChart(percentage) {
    scatter_chart_x = [];
    scatter_chart_y = [];
    var incremental_sum = 0;
    scatter_chart_x.push("% Test Time")
    scatter_chart_y.push("Interfailure Test Time")
    if(percentage == 100 || percentage == 1) {
        for(value in coordinates[0].yCoordinates) {
            incremental_sum += coordinates[0].yCoordinates[value];
            scatter_chart_x.push(incremental_sum);
            scatter_chart_y.push(coordinates[0].yCoordinates[value]);
        }
        var chart = c3.generate({
            bindto: '#full-data-graph',
            data: {
                columns: [
                    scatter_chart_y
                ],
                type: 'scatter'
            },
            axis: {
                x: {
                    label: '% Test Time',
                    categories: scatter_chart_x,
                    tick: {
                        fit: false
                    }
                },
                y: {
                    label: 'Interfailure Test Time'
                }
            }
        });
    }
    // if(percentage == 30 || percentage == .3) {
    //     for(value in coordinates[0].yCoordinates) {
    //         incremental_sum += coordinates[0].yCoordinates[value];
    //         scatter_chart_x.push(incremental_sum);
    //         scatter_chart_y.push(coordinates[0].yCoordinates[value]);
    //     }
    //     var chart = c3.generate({
    //         bindto: '#full-data-graph',
    //         data: {
    //             columns: [
    //                 scatter_chart_y
    //             ],
    //             type: 'scatter'
    //         },
    //         axis: {
    //             x: {
    //                 label: '% Test Time',
    //                 categories: scatter_chart_x,
    //                 tick: {
    //                     fit: false
    //                 }
    //             },
    //             y: {
    //                 label: 'Interfailure Test Time'
    //             }
    //         }
    //     });
    // }
}   
function timeSeries(percentage) {
    timeSeriesX = [];
    timeSeriesY = [];
    var dataAmount;
    timeSeriesY.push("Failure Time")
    if(percentage == 100 || percentage == 1) {
        for(i=0; i < coordinates[0].xCoordinates.length; i++)
                timeSeriesX.push([i+1]);
            console.log(timeSeriesX);
            for(i = 0; i < coordinates[0].yCoordinates.length; i++)
                timeSeriesY.push(coordinates[0].yCoordinates[i]);
            console.log(timeSeriesY);
            var timeSeriesFull = c3.generate({
                bindto: '#full-data-graph',
                padding: {
                    right: 300
                },
                data: {
                    columns: [
                        timeSeriesY
                    ]
                },
                axis: {
                    x: {
                        label: 'Trial #',
                        type: 'category',
                        categories: timeSeriesX,
                        tick: {
                            count: 10,
                            fit: false
                        }
                    }
                },
                point : {
                    show: false
                }
            });
            d3.select('.c3-axis.c3-axis-x').attr('clip-path', "")
    }
    if(percentage == 30 || percentage == .3) {
        //set limit to 30% of data in array
        var upperLimit = coordinates[0].yCoordinates.length;
        for(i=0; i < upperLimit; i++)
                timeSeriesX.push((i+1));
        console.log(timeSeriesX);
        for(i = 0; i < upperLimit; i++)
            timeSeriesY.push(coordinates[0].yCoordinates[i]);
        console.log(timeSeriesY);
        var timeSeriesPartial = c3.generate({
            bindto: '#partial-data-graph',
            padding: {
                right: 300
            },
            data: {
                columns: [
                    timeSeriesY
                ]
            },
            axis: {
                x: {
                    label: 'Trial #',
                    type: 'category',
                    categories: timeSeriesX,
                    tick : {
                        culling: {
                            max: 6,
                            fit: false
                        }
                    }
                }
            }
        });   
        d3.select('.c3-axis.c3-axis-x').attr('clip-path', "")
    }
}
//y Values = 1/(current trial #)*(sum of y vals)
function arithmeticTrend(percentage) {
    var arithmeticTrendX = [];
    var arithmeticTrendY = [];
    var currentIndexSum = 0;
    //Calculates x values (trial number)
    arithmeticTrendY.push("Arithmetic Value")
    if(percentage == 100 || percentage == 1) {
        for(i = 0, len = coordinates[0].yCoordinates.length;i < len; i++)
            arithmeticTrendX.push(i+1);
        for(j = 0, len = coordinates[0].yCoordinates.length;j < len; j++) {
            currentIndexSum += coordinates[0].yCoordinates[j];
            yVal = (1 / (j+1)) * (currentIndexSum);
            arithmeticTrendY.push(yVal);
        }
        console.log(arithmeticTrendY);
        var timeSeriesFull = c3.generate({
            bindto: '#full-data-graph',
            padding: {
                right: 300
            },
            data: {
                columns: [
                    arithmeticTrendY
                ]
            },
            axis: {
                x: {
                    label: 'Trial #',
                    type: 'category',
                    categories: arithmeticTrendX,
                    tick: {
                        count: 10,
                        fit: false
                    }
                }
            }
        });
        d3.select('.c3-axis.c3-axis-x').attr('clip-path', "")
    }
}
function histogram(percentage) {
    var bins = new Object();
    var totalTime = coordinates[0].yCoordinates.reduce(function (prev, curr) {
        return prev + curr;
    });
    console.log("Total Time Sum: " + totalTime);
    bins = {
        bin1: 0, //0.0 to 0.2
        bin2: 0, //0.2 to 0.4
        bin3: 0, //0.4 to 0.6
        bin4: 0, //0.6 to 0.8
        bin5: 0 //0.8 to 1
    }
    for(i = 0;i < coordinates[0].yCoordinates.length;i++) {
        percentOfTotal = (coordinates[0].yCoordinates[i] / totalTime) * 100
        if(between(0.0, 0.2, percentOfTotal))
            bins.bin1 += 1
        else if (between(0.2, 0.4, percentOfTotal))
            bins.bin2 += 1
        else if (between(0.4, 0.6, percentOfTotal))
            bins.bin3 += 1
        else if (between(0.6, 0.8, percentOfTotal))
            bins.bin4 += 1
        else
            bins.bin5 += 1
    }
    binArray = ["Frequency of Times in Range", bins.bin1, bins.bin2, bins.bin3, bins.bin4, bins.bin5];
    var chart = c3.generate({
        bindto: '#full-data-graph',
        data: {
            columns: [
                binArray
            ],
            type: 'bar'
        },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        },
        axis: {
            x: {
                type: 'category',
                categories: ['0%-20%','20%-40%','40%-60%','60%-80%','80%-100%']
            }
        }
    });
}
function cumulative(percentage) {
    cumulativeTrendY = [];
    cumulativeTrendX = [];
    currentIndexSum = 0;
    var totalTime = coordinates[0].yCoordinates.reduce(function (prev, curr) {
        return prev + curr;
    });
    console.log("Total Sum of All Times: " + totalTime)
    cumulativeTrendX.push("% Test Time");
    cumulativeTrendY.push("Cumulative # of Failures");
    //Calculate X Axis Values (Sum up to current index / Total Sum)
    if(percentage == 100 || percentage == 1) {
        for(i = 0, len = coordinates[0].yCoordinates.length; i < len; i++) {
            currentIndexSum += coordinates[0].yCoordinates[i];
            console.log("Current Sum: " + currentIndexSum);
            xVal = (currentIndexSum / totalTime);
            console.log(xVal);
            cumulativeTrendX.push(xVal);
            cumulativeTrendY.push(i);
        }
        //console.log(cumulativeTrendX);
        //console.log(cumulativeTrendY);
        var timeSeriesFull = c3.generate({
            bindto: '#full-data-graph',
            data: {
                x : `% Test Time`,
                columns: [
                    cumulativeTrendX,
                    cumulativeTrendY
                ]
            },
            axis: {
                x: {
                    label: {
                        text: `X Label (Cumulative)`,
                        position: `outer-left`
                    },
                    tick: {
                        fit: false
                    }
                },
                y: {
                    label: {
                        text:  `Y Label Cumulative)`,
                        position: `outer-top`
                    },
                    tick : {
                        fit: false
                    }
                }
            }
        });
    }
}
//Check if a number is between a range
function between(min, max, num) {
    return num > min && num < max
}