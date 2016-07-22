var SD = require('../models/stackdata');

var getQuery = function(query, callback){
  var clear = {}
  for(var k in query){
    if(k === 'stack' && query[k]){
      clear['stack'] = {$all: query[k]};
    } else if (query[k]){
      clear[k] = query[k];
    }
  }
  callback(clear);
}

var getSalary = function(query, callback){
  getQuery(query, function(results){
    SD.find(results, {salary: 1, _id : 0}).exec(function(err, results){
      if(err) return handleError(err);
      callback(results);
    })
  });
};

exports.createSalary = function(data, callback){
  var newSD = new SD (data);
  newSD.save(function(err){
    if(err) return handleError(err);
    callback(newSD);
  })
};

var calculateSalary = function(query, callback){
  getSalary(query, function(results){

    if(results){
      var salaries = [];
      var calcSalary = {};

      for(var s of results){
        salaries.push(s.salary);
      }

      salaries.sort((a,b) => a - b);

      calcSalary.lowest = salaries[0];
      calcSalary.highest = salaries[salaries.length - 1];
      calcSalary.average = Math.ceil(salaries.reduce((a, b) => a + b, 0)/salaries.length);

      callback(calcSalary);
    } else {
      callback("No matching results");
    }

  });
}

exports.querySalary = function(query, callback){
  calculateSalary(query, function(result){
    var title = 'Salaries for';
    if (Array.isArray(query.stack)){
      for (var s of query.stack){
        title += ' ' + s;
      };
    }
    if (!Array.isArray(query.stack)){
      title += ' ' + query.stack;
    }
    if (query.city) title += ' in ' + query.city;
    if (query.city && query.state) title += ', ' + query.state;
    if (query.state && !query.city)  title += ' in ' + query.state;
    result.label = title;
    callback(result)
  });
}

/*
example query
{
  state: String,
  city: String,
  salary: Number,
  stack: Array,
  education: String,
  gender: String,
  experience: Number
}

*/