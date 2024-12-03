const express = require('express')//Web Application framework.
const mongoose = require('mongoose')// Make CRUD operation with MONGODB efficiently.

//Create instance of express.
const app = express()
app.use(express.json())

//Port number
const port = 7000
app.listen(port,() =>{
    console.log("Server is running successfully on port  : "+port)
})

        //Connecting DATABASE
        mongoose.connect('mongodb://localhost:27017/RecipeFinder')
        .then(()=>{
            console.log("Database Connected")
        })
        .catch(()=>{
            console.log(err)//Connectivity issue.
        })

        //CreateSchema -- template for every document.
        const schema = mongoose.Schema({
            title : String ,
            ingredients : [String]
        })

        //CreateModel -- Collection(Table) in name of RecipeItem ---> recipeitems(in plural).
        const recipeItemModel = mongoose.model('RecipeItem',schema)

/**
 *                   Above lines for backend setup and Database creation & connection.
 *                   Below CRUD operation for recipeFinding.
 * 
 */

app.post('/recipeitems',async (req,res) =>{ // Use http instead of https in API testing.
    const {title,ingredients} = req.body
    try{
        const newRecipeItem = new recipeItemModel({title,ingredients})
        await newRecipeItem.save()  //Only New Document can use save() in database ,not for updated document.
        res.status(201).json(newRecipeItem)
    }
    catch(error){
        console.log(error);
        res.status(500)
        
    }
})
app.get('/recipeitems', async (req, res) => {
    try {
        const items = await recipeItemModel.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.get('/findrecipeitems',async (req,res)=>{
    const { targetIngredients } = req.body; // Array of ingredients from the client

    if (!targetIngredients || !Array.isArray(targetIngredients) || targetIngredients.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid input. Provide an array of ingredients.' });
    }

    try {
        // Use regex for case-insensitive matching
        const regexArray = targetIngredients.map(ingredient => new RegExp(ingredient, 'i'));

        // Find recipes where ingredients match any of the target ingredients
        const recipes = await recipeItemModel.find({
            ingredients: { $in: regexArray }
        }).lean(); // `lean()` gives plain JavaScript objects, not Mongoose documents

        // Sort recipes based on how many ingredients match
        const sortedRecipes = recipes.map(recipe => {
            // Count how many of the target ingredients are in the recipe's ingredients
            const matches = recipe.ingredients.filter(ingredient =>
                regexArray.some(regex => regex.test(ingredient))
            ).length;
            return { ...recipe, matchCount: matches }; // Add a match count field to each recipe
        })
        .sort((a, b) => b.matchCount - a.matchCount); // Sort by match count (most to least)

        // Remove matchCount field before sending the response
        const result = sortedRecipes.map(({ matchCount, ...rest }) => rest);

        // Send response back to the client
        if (result.length > 0) {
            res.status(200).json({ success: true, recipes: result });
        } else {
            res.status(404).json({ success: false, message: 'No recipes found.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
//Delete Recipe
app.delete('/recipeitems/:id',async (req,res)=>{
    try {
        const id = req.params.id
    await recipeItemModel.findByIdAndDelete(id)
    res.status(204).end()
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})
