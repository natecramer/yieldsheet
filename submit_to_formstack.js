// Copyright © 2024 Nate Cramer natecramer@gmail.com

var isUploading = false; // if true, it will display The Overlay

var uploadingOverlay = document.getElementById("uploading-overlay");
var uploadingText = document.getElementById("uploading-text");
var uploadingProgTextElem = document.getElementById("uploading-prog-text");
var uploadingBarInner = document.getElementById("uploading-bar-inner");

const max_doughs = 5;

function convertDataToSubmissionJson(thisDough, numDoughs){
  xdata = data;

  var xSubmissionData = {}; // return value


  // absolutely disgusting
  var fieldIDs = {
    info: {
      firstName: 185955255,
      lastName: 185955256,
      location: 185955257,
      shift: 185955265,
      date: 185955268,
      dailyNotes: 185955350,
    },
    totals: {
      doughs: [
        {
          dozens:         185955276,
          scrapAdded:     187407232,
          scrapLeftOver:  187407235,
          donuts:         185955277,
        },
      ],
      other: {
        thisDoughNumber:  185955275,
      },
      totalForTheDay: {
        doughsRan:        185955333,
        dozens:           185955334,
        // scrapAdded:     185437285,
        // scrapLeftOver:  185437286,
        donuts:         185955354,
      },
    },
    doughs: [
      {
        LongJohns:    185955296,
        Bismarks:     185955299,
        Glazed:       185955302,
        Twists:       185955307,
        Honeymooners: 185955310,
        Honeybuns:    185955313,
        TigerTails:   185955316,
        Fritters:     185955319,
        PretzelTwists: 186699837,
        Texas:        185955322,
      },
    ]
  }

  var offset_dict = {};
  var offset_idx = 0;
  for (const property in donuts) {
    offset_dict[property] = offset_idx;
    offset_idx += 3;
  }

  xdata.doughs.forEach(function(dough, dough_idx) {
    Object.entries(dough).forEach(([key, value]) => {

    });
  });

  /*for (var i = 0; i < xdata.doughs.length; i++) */
  {
    var i = thisDough;
    // if (i > max_doughs) {
    //   break;
    // }
    // if (xdata.doughTotals[i].dozens <= 0) {
    //   break;
    // }
    
    var num_donuts = 0;
    var dozens = 0;
    var dozens_plus = 0;
    var screens = 0;
    var screens_plus = 0;
    for (donut_name in xdata.doughs[i]) {
      if (!(donut_name in donuts)) {
        console.log(`ERROR: ${donut_name} found in xdata.doughs . doughs should ONLY be used for donuts. If you need to attach addition data to a dough, please use doughTotals. Please cleanse the data.`);
        continue;
      }
      field_id = fieldIDs.doughs[0][donut_name];

      // Texas donuts only saves the Donut Count, in donuts
      // so 4 donuts = 1 Texas.
      if (donut_name === "Texas"){
        num_donuts = xdata.doughs[i][donut_name].donutCount;
        dozens = Math.floor(num_donuts / 12);
        dozens_plus = num_donuts % 12;
        screens = Math.floor(num_donuts/4); // Texas donuts doesn't use screens, it just uses the donut count
      } else {
        // all other donuts
        // var donut = xdata.doughs[i][donut_name];
        num_donuts = xdata.doughs[i][donut_name].donutCount;
        screens = Math.floor(num_donuts / donuts[donut_name].per_screen);
        screens_plus = num_donuts % donuts[donut_name].per_screen;
        dozens = Math.floor(num_donuts / 12);
        dozens_plus = num_donuts % 12;

      }

      // screens
      if (screens_plus > 0) {
        xSubmissionData[`field_${field_id}`] = `${screens}+${screens_plus}`;
      } else {
        xSubmissionData[`field_${field_id}`] = `${screens}`
      }
      field_id += 1;

      // dozens
      if (dozens_plus > 0) {
        xSubmissionData[`field_${field_id}`] = `${dozens}+${dozens_plus}`;
      } else {
        xSubmissionData[`field_${field_id}`] = `${dozens}`;
      }
      field_id += 1;

      // number of donuts
      xSubmissionData[`field_${field_id}`] = `${num_donuts}`;
      field_id += 1;

      // DEBUG: field test with donut names
      /*
      if (screens_plus > 0) {
        xSubmissionData[`field_${field_id}`] = `${screens}+${screens_plus} ${donut_name} screens`;
      } else {
        xSubmissionData[`field_${field_id}`] = `${screens} ${donut_name} screens`
      }
      field_id += 1;

      // dozens
      if (dozens_plus > 0) {
        xSubmissionData[`field_${field_id}`] = `${dozens}+${dozens_plus} ${donut_name} dozens`;
      } else {
        xSubmissionData[`field_${field_id}`] = `${dozens} ${donut_name} dozens`;
      }
      field_id += 1;

      // number of donuts
      xSubmissionData[`field_${field_id}`] = `${num_donuts} ${donut_name} num_donuts`;
      field_id += 1;
      */
    }

    // piggyback on this for loop to set totals

    field_id = fieldIDs.totals.doughs[0].dozens;
    xSubmissionData[`field_${fieldIDs.totals.doughs[0].dozens}`] = xdata.doughTotals[i].dozens;
    xSubmissionData[`field_${fieldIDs.totals.doughs[0].scrapAdded}`] = xdata.doughTotals[i].scrapAdded;
    xSubmissionData[`field_${fieldIDs.totals.doughs[0].scrapLeftOver}`] = xdata.doughTotals[i].scrapLeftOver;
    xSubmissionData[`field_${fieldIDs.totals.doughs[0].donuts}`] = xdata.doughTotals[i].donuts;
  }

  // total for the day
  xSubmissionData[`field_${fieldIDs.totals.totalForTheDay.dozens}`] = xdata.totalForTheDay.dozens;
  xSubmissionData[`field_${fieldIDs.totals.totalForTheDay.donuts}`] = xdata.totalForTheDay.dozens;

  // dailyNotes
  xSubmissionData[`field_${fieldIDs.info.dailyNotes}`] = xdata.notes;
  

  // firstName
  field_id = fieldIDs.info.firstName;
  xSubmissionData[`field_${field_id}`] = `${xdata.name}`
  // lastName
  xSubmissionData[`field_${fieldIDs.info.lastName}`] = `${xdata.lastName}`
  xSubmissionData[`field_${fieldIDs.info.shift}`] = `${xdata.shift}`

  // location
  const locationStrMap = {
    jeffersonville: "Jeffersonville",
    stmatthews: "St. Matthews",
    hurstbourne: "Hurstbourne Pkwy",
    paristown: "Paristown",
    ferncreek: "Fern Creek",
    springhurst: "Springhurst",
    lexington: "Lexington"
  }

  var locationString = "Unknown";

  if (xdata.location in locationStrMap) {
    locationString = locationStrMap[xdata.location];
  }

  xSubmissionData[`field_${fieldIDs.info.location}`] = locationString;

  // doughs ran
   xSubmissionData[`field_${fieldIDs.totals.totalForTheDay.doughsRan}`] = numDoughs;
  // this dough
   xSubmissionData[`field_${fieldIDs.totals.other.thisDoughNumber}`] = thisDough+1;

  // date
  xSubmissionData[`field_${fieldIDs.info.date}`] = xdata.date.slice(0, xdata.date.indexOf(","));

  console.log(xSubmissionData);
  return xSubmissionData;
}

function uploadingOverlayShow() {
  uploadingOverlay.style.display = "flex";
}

function uploadingOverlayHide() {
  uploadingOverlay.style.display = "none";
}

// Once calling, this function submits 1 dough.
// If submitting mutiple doughs, it will recursively call itself
// when it recieves the HTTP response for the previous dough submitted.
async function xSubmit(submissionData, thisDough, numDoughs) {

  uploadingOverlayShow()

  const formId = 6257070;
  const accessToken = 'b7305d010398e68f8f5ab1a048d703ef';
  const url = `https://proxy.corsfix.com/?https://www.formstack.com/api/v2/form/${formId}/submission.json`;
  // const url = `https://www.formstack.com/api/v2/form/${formId}/submission.json`;
  var options = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(submissionData[thisDough]),
    }
    fetch(url, options)
    .then(response => {
        if (!response.ok) {
          error_message_title = "HTTP Error";
          error_message_contents = `HTTP error! status: ${response.status} Response: ${response}`;
          console.log(error_message_contents)
          uploadingOverlayHide();
            throw new Error(error_message_contents);
        }
        uploadingOverlayHide();
        return response.json();
    })
    .then (data => {
        console.log('Data recieved:', data);
        console.log(`Successfully submitted dough ${thisDough}`);
        if (thisDough < numDoughs-1) {
          xSubmit(submissionData, thisDough+1, numDoughs)
        } else {
          console.log(`Successfully submitted ${numDoughs} doughs!`);
          uploadingOverlayHide();
          confirm(`Submitted ${numDoughs} doughs! Thank you.`);   
        }
    })
    .catch(error => {
        error_message_title = "Error fetching data";
        error_message_contents = `Error fetching data: ${error}`;
        console.error(error_message_contents);
        confirm(`Error: ${error}\n\nTry refreshing the page.`, error);
        uploadingOverlayHide();
        return -1;
    })
}

async function submitToFormstack(){

  // figure out number of doughs ran
  var num_doughs = 0;
  for (var i = 0; i < data.doughs.length; i++) {
    if ( i > max_doughs 
      || data.doughTotals[i].dozens <= 0
    ){
      break;
    }
    
    num_doughs++;
  }

  // Confirmation dialogue
  if (confirm(`Are you sure that you would like to submit ${num_doughs} doughs?`)) {
    console.log(`Attempting to submit ${num_doughs} doughs`);
  } else {
    return;
  }

  var submissionData = [];
  // obtains data from script.js
  for (var i = 0; i < num_doughs; i++) {
    submissionData.push(convertDataToSubmissionJson(i, num_doughs))
  }

  xSubmit(submissionData, 0, num_doughs);
}


function convertDataToSubmissionJson_AllDoughs(){
  xdata = data;

  var xSubmissionData = {}; // return value

  const max_doughs = 5;

  // absolutely disgusting
  var fieldIDs = {
    info: {
      firstName: 185439538,
      lastName: 185439539,
      location: 185439540,
      shift: 185439571,
      date: 185439573,
      dailyNotes: 185437330,
    },
    totals: {
      doughs: [
        {
          dozens:         185437198,
          scrapAdded:     185437199,
          scrapLeftOver:  185437200,
          donuts:         185437467,
        },
        {
          dozens:         185437201,
          scrapAdded:     185437202,
          scrapLeftOver:  185437203,
          donuts:         185437468,
        },
        {
          dozens:         185437204,
          scrapAdded:     185437205,
          scrapLeftOver:  185437206,
          donuts:         185437469,
        },
        {
          dozens:         185437257,
          scrapAdded:     185437258,
          scrapLeftOver:  185437259,
          donuts:         185437470,
        },
        {
          dozens:         185437263,
          scrapAdded:     185437264,
          scrapLeftOver:  185437265,
          donuts:         185437471,
        },
      ],
      totalForTheDay: {
        dozens:         185437284,
        scrapAdded:     185437285,
        scrapLeftOver:  185437286,
        donuts:         185437472,
      },
    },
    doughs: [
      {
        LongJohns:    185376888,
        Bismarks:     185376891,
        Glazed:       185376894,
        Twists:       185376918,
        Honeymooners: 185376942,
        Honeybuns:    185376951,
        TigerTails:   185376955,
        Fritters:     185376958,
        Texas:        185376964,
      },
      {
        LongJohns:    185377009,
        Bismarks:     185377012,
        Glazed:       185377015,
        Twists:       185377018,
        Honeymooners: 185377021,
        Honeybuns:    185377024,
        TigerTails:   185377027,
        Fritters:     185377030,
        Texas:        185377033,
      },
      {
        LongJohns:    185377088,
        Bismarks:     185377091,
        Glazed:       185377094,
        Twists:       185377097,
        Honeymooners: 185377100,
        Honeybuns:    185377103,
        TigerTails:   185377106,
        Fritters:     185377109,
        Texas:        185377112,
      },
      {
        LongJohns:    185377135,
        Bismarks:     185377138,
        Glazed:       185377141,
        Twists:       185377144,
        Honeymooners: 185377147,
        Honeybuns:    185377150,
        TigerTails:   185377153,
        Fritters:     185377156,
        Texas:        185377159,
      },
      { 
        LongJohns:    185377175,
        Bismarks:     185377178,
        Glazed:       185377181,
        Twists:       185377184,
        Honeymooners: 185377187,
        Honeybuns:    185377190,
        TigerTails:   185377193,
        Fritters:     185377196,
        Texas:        185377199,
      },
    ]
    // {
    //   longJohns:    ,
    //   Bismarks:    ,
    //   Glazed:       ,
    //   Twists:       ,
    //   Honeymooners: ,
    //   Honeybuns:    ,
    //   TigerTails:   ,
    //   Fritters:     ,
    //   Texas:        ,
    // },
  }

  var offset_dict = {};
  var offset_idx = 0;
  for (const property in donuts) {
    offset_dict[property] = offset_idx;
    offset_idx += 3;
  }

  xdata.doughs.forEach(function(dough, dough_idx) {
    Object.entries(dough).forEach(([key, value]) => {

    });
  });

  for (var i = 0; i < xdata.doughs.length; i++) {
    if (i > max_doughs) {
      break;
    }
    var num_donuts = 0;
    var dozens = 0;
    var dozens_plus = 0;
    var screens = 0;
    var screens_plus = 0;
    for (donut_name in xdata.doughs[i]) {
      field_id = fieldIDs.doughs[i][donut_name];

      // Texas donuts only saves the Donut Count, in donuts
      // so 4 donuts = 1 Texas.
      if (donut_name === "Texas"){
        num_donuts = xdata.doughs[i][donut_name].donutCount;
        dozens = Math.floor(num_donuts / 12);
        dozens_plus = num_donuts % 12;
        screens = Math.floor(num_donuts/4); // Texas donuts doesn't use screens, it just uses the donut count
      } else {
        // all other donuts
        // var donut = xdata.doughs[i][donut_name];
        num_donuts = xdata.doughs[i][donut_name].donutCount;
        screens = Math.floor(num_donuts / donuts[donut_name].per_screen);
        screens_plus = num_donuts % donuts[donut_name].per_screen;
        dozens = Math.floor(num_donuts / 12);
        dozens_plus = num_donuts % 12;

      }

      // screens
      if (screens_plus > 0) {
        xSubmissionData[`field_${field_id}`] = `${screens}+${screens_plus}`;
      } else {
        xSubmissionData[`field_${field_id}`] = `${screens}`
      }
      field_id += 1;

      // dozens
      if (dozens_plus > 0) {
        xSubmissionData[`field_${field_id}`] = `${dozens}+${dozens_plus}`;
      } else {
        xSubmissionData[`field_${field_id}`] = `${dozens}`;
      }
      field_id += 1;

      // number of donuts
      xSubmissionData[`field_${field_id}`] = `${num_donuts}`;
      field_id += 1;

      // DEBUG: field test with donut names
      /*
      if (screens_plus > 0) {
        xSubmissionData[`field_${field_id}`] = `${screens}+${screens_plus} ${donut_name} screens`;
      } else {
        xSubmissionData[`field_${field_id}`] = `${screens} ${donut_name} screens`
      }
      field_id += 1;

      // dozens
      if (dozens_plus > 0) {
        xSubmissionData[`field_${field_id}`] = `${dozens}+${dozens_plus} ${donut_name} dozens`;
      } else {
        xSubmissionData[`field_${field_id}`] = `${dozens} ${donut_name} dozens`;
      }
      field_id += 1;

      // number of donuts
      xSubmissionData[`field_${field_id}`] = `${num_donuts} ${donut_name} num_donuts`;
      field_id += 1;
      */
    }

    // piggyback on this for loop to set totals

    field_id = fieldIDs.totals.doughs[i].dozens;
    xSubmissionData[`field_${fieldIDs.totals.doughs[i].dozens}`] = xdata.doughTotals[i].dozens;
    xSubmissionData[`field_${fieldIDs.totals.doughs[i].scrapAdded}`] = xdata.doughTotals[i].scrapAdded;
    xSubmissionData[`field_${fieldIDs.totals.doughs[i].scrapLeftOver}`] = xdata.doughTotals[i].scrapLeftOver;
    xSubmissionData[`field_${fieldIDs.totals.doughs[i].donuts}`] = xdata.doughTotals[i].donuts;
  }

  // total for the day
  xSubmissionData[`field_${fieldIDs.totals.totalForTheDay.dozens}`] = xdata.totalForTheDay.dozens;
  xSubmissionData[`field_${fieldIDs.totals.totalForTheDay.scrapAdded}`] = xdata.totalForTheDay.scrapAdded;
  xSubmissionData[`field_${fieldIDs.totals.totalForTheDay.scrapLeftOver}`] = xdata.totalForTheDay.scrapLeftOver;
  xSubmissionData[`field_${fieldIDs.totals.totalForTheDay.donuts}`] = xdata.totalForTheDay.dozens;

  // dailyNotes
  xSubmissionData[`field_${fieldIDs.info.dailyNotes}`] = xdata.notes;
  

  // firstName
  field_id = fieldIDs.info.firstName;
  xSubmissionData[`field_${field_id}`] = `${xdata.name}`
  // lastName
  xSubmissionData[`field_${fieldIDs.info.lastName}`] = `${xdata.lastName}`
  xSubmissionData[`field_${fieldIDs.info.shift}`] = `${xdata.shift}`

  // location
  const locationStrMap = {
    jeffersonville: "Jeffersonville",
    stmatthews: "St. Matthews",
    hurstbourne: "Hurstbourne Pkwy",
    paristown: "Paristown",
    ferncreek: "Fern Creek",
    springhurst: "Springhurst",
    lexington: "Lexington"
  }

  var locationString = "Unknown";

  if (xdata.location in locationStrMap) {
    locationString = locationStrMap[xdata.location];
  }

  xSubmissionData[`field_${fieldIDs.info.location}`] = locationString;

  console.log(xSubmissionData);
  return xSubmissionData;
}

async function submitToFormstack_AllDoughs(e){
    const formId = 6222173;
    const accessToken = 'b7305d010398e68f8f5ab1a048d703ef';
    const url = `https://proxy.corsfix.com/?https://www.formstack.com/api/v2/form/${formId}/submission.json`;
    // const url = `https://www.formstack.com/api/v2/form/${formId}/submission.json`;

    var submissionData = convertDataToSubmissionJson(); // obtains data from script.js

    var options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(submissionData),
    }
    fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} Response: ${response}`);
        }
        return response.json();
    })
    .then (data => {
        console.log('Data recieved:', data);
        confirm("Yield submitted. Thank you!");
    })
    .catch(error => {
        console.error('Error fetching data: ', error);
        confirm("Error: ", error);
    })
}

/////////////////////////////////////////////////////////////////////////////

// var submit_button = document.querySelector("#btn-submit");
// submit_button.addEventListener("click", xsubmit, false);

// var get_button = document.querySelector("#btn-get");
// get_button.addEventListener("click", xget2, false);

// var long_johns = document.querySelector("#longjohns");
// var bismarcks = document.querySelector("#bismarcks");
// var glazed = document.querySelector("#glazed");

async function xget_(e) {
    var formId = 6222173;
    const mockform = {id:formId, name:'My First Formstack Form'}
    axios.get({data:mockform});
    const result = await getForm(formId);
    console.log(result);
}

async function xget2(e){
    const formId = 6222173;
    const accessToken = 'b7305d010398e68f8f5ab1a048d703ef';
    const apiUrl = `https://proxy.corsfix.com/?https://www.formstack.com/api/v2/form/${formId}.json`;

    fetch(apiUrl, {
        method: 'GET', // Specify GET request
        mode: 'cors',
        headers: {
          'Accept': 'application/json', // Indicate preference for JSON response
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then(response => {
          // Check if the response is successful (status code 200)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // Parse the JSON response
          return response.json();
        })
        .then(data => {
          // Handle the retrieved form data
          console.log('Form details:', data);
          // The 'data' object will contain information about the form,
          // such as its ID, name, description, etc.
        })
        .catch(error => {
          // Handle any errors that occurred during the request
          console.error('Error fetching form details:', error);
        });
}

async function xget(e) {
    var formId = 6222173;
    var accessToken = 'b7305d010398e68f8f5ab1a048d703ef';
    var url = `https://www.formstack.com/api/v2/form/${formId}/basic.json`;
    var options = {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            'Authorization': `Bearer &lt;${accessToken}&gt`
            // ,
            // 'Access-Control-Allow-Origin': '*'
        }
    }
    fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} Response: ${response}`);
        }
        return response.json();
    })
    .then (data => {
        console.log('Data recieved:', data);
    })
    .catch(error => {
        console.error('Error fetching data: ', error);
    })
}