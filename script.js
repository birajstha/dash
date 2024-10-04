document.addEventListener("DOMContentLoaded", function () {
    var subjectTabs = document.getElementById("subjectTabs");
    var tabContentContainer = document.getElementById(
      "tabContentContainer"
    );

    var csvUrl = `https://raw.githubusercontent.com/birajstha/postproc/refs/heads/main/strict/strict.csv`;
    d3.csv(csvUrl).then(function (csv) {
      console.log(csv);

      // Extract unique subjects from the CSV data
      var subjects = Array.from(new Set(csv.map((d) => d.sub)));

      subjects.forEach(function (subject, index) {
        var tab = document.createElement("li");
        tab.className = "nav-item";
        var tabIndex = index === 0 ? "active" : "";
        tab.innerHTML = `<a class="nav-link ${tabIndex}" id="${subject}-tab" data-toggle="tab" href="#${subject}" role="tab" aria-controls="${subject}" aria-selected="true">${subject}</a>`;
        subjectTabs.appendChild(tab);

        var tabContent = document.createElement("div");
        tabContent.className = `tab-pane fade ${tabIndex}`;
        tabContent.id = subject;
        tabContentContainer.appendChild(tabContent);

        tab.addEventListener("click", function () {
          openTab(subject);
        });
      });

      // Open the first tab by default
      if (subjects.length > 0) {
        openTab(subjects[0]);
      }
    });
  });

  function openTab(tabName) {
    var tabs = document.querySelectorAll(".tab-pane");

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("show", "active");
    }

    var tabContent = document.getElementById(tabName);
    if (tabContent) {
      tabContent.classList.add("show", "active");
      tabContent.innerHTML = "";
      console.log("Opening tab:", tabName);

      var csvUrl = `https://raw.githubusercontent.com/birajstha/postproc/refs/heads/main/strict/strict.csv`;
      d3.csv(csvUrl).then(function (csv) {
        console.log(csv);

        if (Array.isArray(csv)) {
          var uniqueSesScanReg = Array.from(
            new Set(
              csv
                .filter((d) => d.sub == tabName)
                .map((d) => `${d.ses}_${d.scan}_${d.reg}`)
            )
          );

          //console.log(uniqueSesScanReg);

          // Loop over the uniqueSesScanReg and create a row for each
          for (var i = 0; i < uniqueSesScanReg.length; i++) {
            var rowContainer = document.createElement("div");
            rowContainer.className = "row";

            var sesScanReg = uniqueSesScanReg[i];
            var imageNames = ["space-MNI152NLin2009cAsym"];

            for (var j = 0; j < imageNames.length; j++) {
              var imageName = `${tabName}_${sesScanReg}_${imageNames[j]}.png`;
              //console.log("Image name:", imageName);
              // example file name : PA001_V1W1_facesmatching_run-1_GSR_space-MNI152NLin2009cAsym.png
              var imageContainer_strict = document.createElement("div");
              imageContainer_strict.className = "col-12 col-sm-6 col-md-6";
              imageContainer_strict.innerHTML = `
                <div style="padding: 10px;">
                    <img src="./strict/${imageName}" class="img-fluid" style="padding: 10px; clip-path: inset(40px 0 0 0);" />
                    <h6 style="padding: 1px;">Strict-${imageName}</h6>
                </div>`;
              rowContainer.appendChild(imageContainer_strict);

              var imageContainer_lenient = document.createElement("div");
              imageContainer_lenient.className = "col-12 col-sm-6 col-md-6";
              imageContainer_lenient.innerHTML = `
                <div style="padding: 10px;">
                    <img src="./lenient/${imageName}" class="img-fluid" style="padding: 10px; clip-path: inset(40px 0 0 0);" />
                    <h6 style="padding: 1;">Lenient-${imageName}</h6>
                </div>`;
              rowContainer.appendChild(imageContainer_lenient);
            }

            // Append rowContainer to tabContent
            tabContent.appendChild(rowContainer);
          }
        } else {
          console.error("CSV data is not an array:", csv);
        }
      });
    } else {
      console.error(`Tab content with ID ${tabName} not found.`);
    }
  }