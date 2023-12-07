
      // Create the modal container
      const modalContainer = document.createElement('div');
      modalContainer.classList.add('modal', 'fade');
      modalContainer.id = 'staticBackdrop';
      modalContainer.setAttribute('data-bs-backdrop', 'static');
      modalContainer.setAttribute('data-bs-keyboard', 'false');
      modalContainer.tabIndex = '-1';
      modalContainer.setAttribute('aria-labelledby', 'staticBackdropLabel');
      modalContainer.setAttribute('aria-hidden', 'true');
      
      // Create the modal dialog
      const modalDialog = document.createElement('div');
      modalDialog.classList.add('modal-dialog');
      
      // Create the modal content
      const modalContent = document.createElement('div');
      modalContent.classList.add('modal-content');
      
      // Create the modal header
      const modalHeader = document.createElement('div');
      modalHeader.classList.add('modal-header');
      
      const modalTitle = document.createElement('h5');
      modalTitle.classList.add('modal-title', 'alice');
      modalTitle.id = 'staticBackdropLabel';
      modalTitle.textContent = 'Sending Data';
      
      const closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.id = 'mclosebtn';
      closeButton.classList.add('btn-close', 'disabled');
      closeButton.setAttribute('data-bs-dismiss', 'modal');
      closeButton.setAttribute('aria-label', 'Close');
      
      modalHeader.appendChild(modalTitle);
      modalHeader.appendChild(closeButton);
      
      // Create the modal body
      const modalBody = document.createElement('div');
      modalBody.classList.add('modal-body', 'alice');
      
      // Create the modal footer
      const modalFooter = document.createElement('div');
      modalFooter.classList.add('modal-footer', 'alice');
      
      const messageParagraph = document.createElement('p');
      messageParagraph.id = 'msg';
      
      modalFooter.appendChild(messageParagraph);
      
      // Append all elements to build the modal
      modalContent.appendChild(modalHeader);
      modalContent.appendChild(modalBody);
      modalContent.appendChild(modalFooter);
      
      modalDialog.appendChild(modalContent);
      
      modalContainer.appendChild(modalDialog);
      
      // Append the modal container to the body
      document.body.appendChild(modalContainer);
      
      
      
      //********* CODES START FOR FORM SUBMISSION */
      
      
      //Upload function for adding record in dataabase which will be called by add function
      
      // Local host testing
      // var apiurl="http://127.0.0.1:5001/maximal-security-services/us-central1/submitData";
      
      
      function upload(st) {
          // alert(JSON.stringify(st));
          var apiurl="https://us-central1-maximal-security-services.cloudfunctions.net/submitData";
          // return
        fetch(apiurl, {
          method: 'POST',
          body: JSON.stringify(st),
          headers: {
            'Content-type': 'application/json',
          },
        })
          .then(function (response) {
            if (!response.ok) {
              // Check for HTTP error status
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(function (data) {
            // Check for a success property in the response data
            if (data.success) {
              $('.modal-title').html('Data Sent.');
              $('.modal-body').html('<h3 class="text-success alice">Your Form Has Been Successfully Submitted! Our Representative Will Contact You Soon.</h3>');
             
              // alert('Your request was received successfully.');
            } else {
              // Handle server-side errors or unexpected response
              throw new Error('Server error: ' + data.message);
            }
          })
          .catch(function (error) {
            // Handle errors including network errors and server errors
            $('.modal-title').html('Data Sending Fail...');
            $('.modal-body').html('<h3 class="text-danger alice">Something went wrong. Please try again later. ' + error.message+'</h3>');
          });
      }
      // Function for adding data to listbox and database
      function add()
      {
      
        if (Form.checkValidity()) 
        {
              AOS.init({disable:true}); //Otherwiste AOS F*ck your Modal and it will not open.
              $('#staticBackdrop').modal('show');
              $('.modal-title').html('Sending Data...');
              $('.modal-body').html('<p class="alice">Please wait until data is submitted and confirmation is received. Please do not close the browser window.</p>');
             
                var st = {};
                st.Email=email.value
                st.FirstName=fname.value;
                st.LastName=lname.value;
                st.CompanyName=cname.value;
                st.JobTitle=job.value;
                st.State=state.value;
                st.Phone=phone.value;
                st.City=city.value;
                st.PostalCode=postal.value;
                st.Comments=comments.value;
                st.Reqtype="SCHEDULE A CONSULTATION";
                // alert(JSON.stringify(st))
                upload(st);
                $('#mclosebtn').removeClass('disabled');
                AOS.init({disable:false});
                return;
        }
      }
      
      
      