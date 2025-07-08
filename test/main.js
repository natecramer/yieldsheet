const api = axios.create({
    baseURL: 'https://www.formstack.com/api/v2',
    headers: { 'Authorization': `Bearer &lt;b7305d010398e68f8f5ab1a048d703ef&gt` }
  });
  
  
  // GET: Retrieve form data
  async function getForm(formId) {
      try {
        const response = await api.get(`/form/${formId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    }
    
    // POST: Submit form data
    async function submitForm(formId, data) {
      try {
        const response = await api.post(`/form/${formId}/submission`, data);
        return response.data;
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
    
    // PUT: Update form fields
    async function updateField(formId, fieldId, data) {
      try {
        const response = await api.put(`/form/${formId}/field/${fieldId}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating field:', error);
      }
    }
    
    // DELETE: Remove form submission
    async function deleteSubmission(submissionId) {
      try {
        await api.delete(`/submission/${submissionId}`);
        console.log('Submission deleted successfully');
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  
    api.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          console.error('API Error:', error.response.data);
        }
        return Promise.reject(error);
      }
    );

/////////////////////////////////////////////////////////////////////////////

var submit_button = document.querySelector("#btn-submit");
submit_button.addEventListener("click", xsubmit, false);

var get_button = document.querySelector("#btn-get");
get_button.addEventListener("click", xget, false);

var long_johns = document.querySelector("#longjohns");
var bismarcks = document.querySelector("#bismarcks");
var glazed = document.querySelector("#glazed");

function xsubmit(e) {

}

async function xget_(e) {
    var formId = 6222173;
    const mockform = {id:formId, name:'My First Formstack Form'}
    axios.get({data:mockform});
    const result = await getForm(formId);
    console.log(result);
}

async function xget(e) {
    var formId = 6222173;
    var url = 'https://www.formstack.com/api/v2/form/6222173/basic.json';
    var options = {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'accept': 'application/json',
            'authorization': 'Bearer b7305d010398e68f8f5ab1a048d703ef'/*,
            'Access-Control-Allow-Origin': '*'*/
        }
    }
    fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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