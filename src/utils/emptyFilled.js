
function countEmptyFields(obj) {

  let count = 0;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value === undefined || value === null || value === '') {
        count++;
      } else if (typeof value === 'object') {
        count += countEmptyFields(value);
      }
    }
  }

  return count

};

function calculateTrueFalsePercentage(data) {
  const totalCount = Object.keys(data).length;
  let trueCount = 0;

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] === true) {
      trueCount++;
    }
  }

  const truePercentage = (trueCount / totalCount) * 100;

  return truePercentage;
}


async function recaptcharVerify(rc_token) {
  const response_key = rc_token
  const secret_key = "6Le7cakpAAAAACx2VHeas2yDXSF0NyLcI_31dxST";
  const options = {
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
  }

  const re = await request(options);

  if (!JSON.parse(re.body)['success']) {
    return 'Verification failed, please try again'
  }
}

module.exports = { countEmptyFields, calculateTrueFalsePercentage, recaptcharVerify }