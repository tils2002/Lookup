var express = require('express');
var router = express.Router();
var subdata = require('../models/sub_schema');
var users = require('../models/register_schema');
var category = require('../models/category_schema');
var subcategory = require('../models/subcategory_schema');


const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const registerobj = Joi.object({
  firstname: Joi.string().trim().pattern(/^\S+$/).required().messages({
    'string.pattern.base': 'First name cannot contain whitespace.',
    'any.required': 'First name is required.'    
  }),
  lastname: Joi.string().trim().pattern(/^\S+$/).required().messages({
    'string.pattern.base': 'Last name cannot contain whitespace.',
    'any.required': 'Last name is required.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email .',
    'any.required': 'Email is required.'
  }),
  dob: Joi.date().messages({
    'date.base': 'Invalid date format.',
  }),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
    'string.pattern.base': 'Invalid phone number .',
    'any.required': 'Phone number is required.'
  }),
  password: Joi.string().trim().min(6).required().messages({
    'string.min': 'Password must be at least {#limit} characters long.',
    'any.required': 'Password is required.'
  }),
  repassword: Joi.string().trim().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords not match.',
    'any.required': 'Please confirm your password.'
  })
})
const validateRegistration = (req, res, next) => {
  const validationResult = registerobj.validate(req.body);
  if (validationResult.error) {
    const errorMessages = validationResult.error.details.map((error) => error.message);
    res.status(400).json({ status: false, message: errorMessages });
  } else {
    next();
  }
};

router.post('/register', validateRegistration, validator.body(registerobj), async function (req, res, next) {
  try {
    const existingData = await YourModel.findOne({ uniqueIdentifier: dataToInsert.uniqueIdentifier });
    if(existingData){
      res.status(400).json({
        status: false,
      messages:'Data already exists'
    })
  }
  else{
    var data = await users.create(req.body)
    res.status(200).json({
      status: true,
      data
    })
  }
}
  catch (err) {
    res.status(400).json({
      status: false,
      err
    })
  }
})
const loginobj = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Invalid email format.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least {#limit} characters long.',
    'any.required': 'Password is required.'
  })
})
const validateLogin = (req, res, next) => {
  const validationResult = loginobj.validate(req.body);
  if (validationResult.error) {
    const errorMessages = validationResult.error.details.map((error) => error.message);
    res.status(400).json({ status: false, message: errorMessages });
  } else {
    next();
  }
};
router.post('/login', validateLogin, validator.body(loginobj), async function (req, res, next) {
  console.log(req.body.email);
  console.log(req.body.password);
  try {
    var data = await users.findOne({ "email": req.body.email, "password": req.body.password },
    { firstname: 1, lastname: 1, email: 1, _id: 0 });
    if (data){
      res.status(200).json({
        status: true,
        data
      });
    } 
    else {
      const userWithEmail = await users.findOne({ "email": req.body.email });
      if (!userWithEmail) { 
        res.status(400).json({
          status: false,
          message: 'Email is not registered'
        });
      } 
      else {
        res.status(400).json({
          status: false,
          message: 'Incorrect password'
        });
      }
    }
  } 
  catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      message: 'An unexpected error occurred'
    });
  }
});
const maincategoryobj = Joi.object({
  maincategory: Joi.string().trim().required().messages({
  
    'any.required': 'category is require.'
  }),
  description: Joi.string().trim().required().messages({
    'any.required': 'description is required.'
  })
})
const validateMain = (req, res, next) => {
  const validationResult = maincategoryobj.validate(req.body);
  if (validationResult.error) {
    const errorMessages = validationResult.error.details.map((error) => error.message);
    res.status(400).json({ status: false, message: errorMessages });
  } else {
    next();
  }
};
router.post('/maincategory', validateMain, async function (req, res, next) {
  try {
    const { maincategory, description } = req.body;

    const existingCategory = await category.findOne({ maincategory });
    if (existingCategory) {
      return res.status(400).json({ status: false, message: 'Main category already exists.' });
    }
    else{
    try{
      const data = await category.create({ maincategory, description });
    return res.status(200).json({ status: true,messages:'Main category insert Succes' ,data });
    }
      catch (err) {
        return res.status(400).json({ status: false, messages:'Internal Error' ,err });
      }
    }
    
  } catch (err) {
    return res.status(400).json({ status: false, messages:'Internal Error' ,err });
  }
});

router.get('/maindataget', async function (req, res, next) {
  try {
    var data = await category.find()

    res.status(200).json({
      status: true,
      data
    }) 
  } catch (err) {
    res.status(400).json({
      status: false,
      err
    })
  }
});

const subcategoryobj = Joi.object({
  maincategoryid: Joi.string().trim().pattern(/^\S+$/).required().messages({
    'string.pattern.base': 'subcategory name cannot contain whitespace.',
    'any.required': 'maincategoryid is require.'
  }),
  subcategory: Joi.string().trim().pattern(/^[a-z]+$/).required().messages({
    'string.pattern.base': 'subcategory name can only contain lowercase letters.',
    'any.required': 'subcategory is require.'
  }),
  description: Joi.string().trim().required().messages({
    'any.required': 'description is required.'
  })
})
const validateSub = async (req, res, next) => {
  try {
    const validationResult = subcategoryobj.validate(req.body);
    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map((error) => error.message);
      return res.status(400).json({ status: false, message: errorMessages });
    }
    const existingSubcategory = await subcategory.findOne({
      maincategoryid: req.body.maincategoryid,
      subcategory: req.body.subcategory,
      _id: { $ne: req.params.id } 
    });

    if (existingSubcategory) {
      return res.status(400).json({ status: false, message: 'Subcategory already exists for this main category.' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};
router.post('/subcategory',validateSub ,validator.body(subcategoryobj),  async function (req, res, next) {
  try {
    var data = await subcategory.create(req.body)
    res.status(200).json({
      status: true,
      messages:'Data insert Succes',
      data
    })
  }
  catch (err) {
    res.status(400).json({
      status: false,
      err
    })
  }
})

router.get('/categories', async function(req, res, next){
  try {
      var categoriesWithSubcategories = await category.aggregate([
          {
              $lookup: {
                  from: 'subcategories', 
                  localField: '_id',
                  foreignField: 'maincategoryid', 
                  as: 'Subcategories'
              }
          },
          {
              $unwind: '$Subcategories'
          }
      ]);      

      res.json(categoriesWithSubcategories);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


const subdataobj = Joi.object({
  maincategoryid: Joi.string().trim().pattern(/^\S+$/).required().messages({
    'string.pattern.base': 'maincategoryid cannot contain whitespace.',
    'any.required': 'maincategoryid is required.'
  }),
  subcategoryid: Joi.string().trim().pattern(/^\S+$/).required().messages({
    'string.pattern.base': 'subcategoryid cannot contain whitespace.',
    'any.required': 'subcategoryid is required.'
  }),
  subdata: Joi.string().trim().pattern(/^[a-z,0-9]+$/).required().messages({
    'string.pattern.base': 'subdata name can only contain lowercase letters.',
    'any.required': 'subdata is required.'
  }),
  description: Joi.string().trim().required().messages({
    'any.required': 'description is required.'
  }),
  name: Joi.string().allow('', null) 
})
const validateSubdata = async (req, res, next) => {
  try {
    const validationResult = subdataobj.validate(req.body);
    if (validationResult.error) { 
      const errorMessages = validationResult.error.details.map((error) => error.message);
      return res.status(400).json({ status: false, message: errorMessages });
    }
    const existingSubdata = await subdata.findOne({
      maincategoryid: req.body.maincategoryid,
      subcategoryid: req.body.subcategoryid,
      subdata: req.body.subdata,
      _id: { $ne: req.params.id } 
    });
    if (existingSubdata) {
      return res.status(400).json({ status: false, message: 'Subcategory already exists for this main category.' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

router.post('/subdata',validateSubdata ,validator.body(subdataobj),  async function (req, res, next) {
  try {
    var data = await subdata.create(req.body)
    res.status(200).json({
      status: true,
      messages:'Data is insert Succes',
      data
    })
  }
  catch (err) {
    res.status(400).json({
      status: false,
      err
    })
  }
})



router.get('/subdataget', async function(req, res, next) {
  try {
      var categoriesWithSubcategories = await category.aggregate([
          {
              $lookup: {
                  from: 'subcategories',
                  localField: '_id',
                  foreignField: 'maincategoryid',
                  as: 'SubcategoryName'
              }
          },
          {
              $unwind: '$SubcategoryName'
          },
          {
              $lookup: {
                  from: 'subdatas',
                  localField: 'SubcategoryName._id', 
                  foreignField: 'subcategoryid',
                  as: 'SubcategoryName.Subdata' 
              }
          },
          {
              $unwind: '$SubcategoryName.Subdata'
          }
      ]);
      res.json(categoriesWithSubcategories);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


router.get('/subcatdataget', async function (req, res, next) {
  try {
    var mainCategoryId = req.query.mainCategoryId; 
    var data = await subcategory.find({ maincategoryid: mainCategoryId }); 
    res.status(200).json({
      status: true,
      data
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      err
    });
  }
});

// maincategory update data 
router.patch('/maindataupdate/:id',validateMain, async function(req, res, next){

  try {
    const { maincategory, description } = req.body;
    const existingCategory = await category.findOne({ maincategory ,_id: { $ne: req.params.id } });
    if (existingCategory) {
      return res.status(400).json({ status: false, message: 'Main category already exists.' });
    }
    else{
    try{
      const data = await category.findByIdAndUpdate(req.params.id, req.body );
    return res.status(200).json({ status: true,messages:'Main category insert Succes' ,data });
    }
      catch (err) {
        return res.status(400).json({ status: false, messages:'Internal Error' ,err });
      }
    }
    
  } catch (err) {
    return res.status(400).json({ status: false, messages:'Internal Error' ,err });
  }
})
router.patch('/subcategoryupdate/:id', validateSub, validator.body(subcategoryobj), async function (req, res, next) {
  try {
    var data = await subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({
      status: true,
      message: 'Data updated successfully',
      data
    })
  } catch (err) {
    res.status(400).json({
      status: false,
      error: err.message // It's better to send error message only
    })
  }
})
router.patch('/subdataupdate/:id',validateSubdata ,validator.body(subdataobj),  async function (req, res, next) {
  try {
    var data = await subdata.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({
      status: true,
      messages:'Data is updated Succes',
      data
    })
  }
  catch (err) {
    res.status(400).json({
      status: false,
      err
    })
  }
})



router.get('/maindataget/:id', async function (req, res, next) {
  try {
    console.log("Received request for ID:", req.params.id); 
    var data = await category.findById(req.params.id)

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Data not found"
      });
    }

    res.status(200).json({
      status: true,
      data
    });
  } catch (err) {
    console.error("Error fetching data:", err); 
    res.status(400).json({
      status: false,
      error: err.message 
    });
  }
});
router.get('/categories/:id', async function(req, res, next) {
  try {
    // Find the main category by ID
    const categoryId = req.params.id;
    const data = await subcategory.findById(categoryId);

    // If the category is not found, return a 404 status response
    if (!data) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Send the response containing the main category and its subcategories
    res.json({data });
  } catch (error) {
    // If an error occurs, send a 500 status response with an error message
    res.status(500).json({ message: error.message });
  }
});
router.get('/subdata/:id', async function(req, res, next) {
  try {
    // Find the main category by ID
    const categoryId = req.params.id;
    const data = await subdata.findById(categoryId);

    // If the category is not found, return a 404 status response
    if (!data) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Send the response containing the main category and its subcategories
    res.json({data });
  } catch (error) {
    // If an error occurs, send a 500 status response with an error message
    res.status(500).json({ message: error.message });
  }
});




router.delete('/maincategory/:id', async function(req, res, next) {
  try {
    const categoryId = req.params.id;

    // Check if the category exists
    const existingCategory = await category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        status: false,
        message: 'Category not found'
      });
    }

    // Delete the category
    await category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      status: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
  }
});
router.delete('/subcategory/:id', async function(req, res, next) {
  try {
    const id = req.params.id;

  

    // Delete the category
    await subcategory.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
  }
});
router.delete('/subdata/:id', async function(req, res, next) {
  try {
    const id = req.params.id;

  

    // Delete the category
    await subdata.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
