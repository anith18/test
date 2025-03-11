const express=require('express');
const router=express.Router();
const fetchuser=require('../middleware/fetchuser');
const Notes=require('../modules/Notes');
const {body,validationResult}=require('express-validator');

//ROUTE 1: get all the notes usig get api /api/notes/fetchallnotes
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try{
    const notes=await Notes.find({user:req.user.id});
    res.json({notes});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("internal sever error");
    }
});


//ROUTE 2: add the notes usig post   api /api/notes/fetchallnotes
router.post('/addnote',fetchuser,[
    body('title','enter a valid name').isLength({min:3}),
    body('description','enter a valid email').isLength({min:5})
],async (req,res)=>{
    try{
    const {title,description,tag}=req.body;
    const errors=validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const note=new Notes({
        title, description, tag, user:req.user.id
    })
    const savednote=await note.save()
    res.json(savednote);
}
catch(error){
    console.error(error.message);
    res.status(500).send("internal sever error");
}

});

// ROUTE: 3 update an existing note using post "/api/notes/addnote"  
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    const {title,description,tag}=req.body;
    try{
    const newnote={}
    if(title){newnote.title=title};
    if(description){newnote.description=description};
    if(tag){newnote.tag=tag};
//find the note to be updated
let note=await Notes.findById(req.params.id);
if(!note){res.status(404).send("Not found");}

//allow if user is allowed to update
if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not allowed");
}
note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });

res.json(note); // Send the updated note
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});
// ROUTE: 4 delete an existing note using post "/api/notes/deletenote"  
// router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
//     const {title,description,tag}=req.body;
// try{
// //find the node to be deleted
// let note=await Notes.findById(req.params.id);
// if(!note){res.status(404).json({error:"Not found"});}

// //check for the user
// if(note.user.toString()!==req.user.id){
//     return res.status(401).json({error:"Not allowed"});
// }
// note = await Notes.findByIdAndDelete(req.params.id);

// res.json({"success":"node has been deleted successfully",note:note}); // Send the updated note

// }
// catch(error){
//     console.error(error.message);
//     res.status(500).send("Internal server error");
// }
// });
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Notes.findById(req.params.id);

        // If the note is not found, return a 404 error
        if (!note) {
            return res.status(404).json({ error: "Note not found" });  // ✅ Return after response
        }

        // Ensure the user owns the note before deleting
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not allowed" });  // ✅ Return after response
        }

        // Delete the note
        await Notes.findByIdAndDelete(req.params.id);

        res.json({ success: "Note has been deleted successfully", note });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports=router;