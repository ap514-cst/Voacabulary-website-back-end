const phreseService=require("../model/phrese_Model");

const addPhrese=async(req,res)=>{
    try{
        const{englishWord,banglaMeaning}=req.body;

        if(!englishWord || !banglaMeaning){
            return res.status(400).json({
                success:false,
                message:"fill all field"
            })
        }
        const newPhrese=new phreseService({
            englishWord,
            banglaMeaning,
        })
        const savePhrese=await newPhrese.save();
        res.status(201).json({
            success:true,
            message:"phrese added successfully",
            data:savePhrese
        })
    } catch(error){
        res.status(500).json({
            message:"server error"
        })
    }
}

//bulk add phrese..
const bulkaddPhress=async(req,res)=>{
    
    try {
        const words=req.body.words;

        if(!Array.isArray(words)){
            return res.status(400).json({message:"invalid data"})
        }
        const existingWords=await phreseService.find({},{englishWord:1});
        const existingSet=new Set(
            existingWords.map(w=>w.englishWord.toLowerCase())
        )
        
        const filteredWords=words.filter(word=>{
            return word.englishWord && !existingSet.has(word.englishWord.toLowerCase())
        })
        const result=await phreseService.insertMany(filteredWords);
        
        res.json({
            message:"bulk insert completed",
            added:result.length
        })
    } catch (error) {
        res.status(500).json({
            message:"server error"
        })
    }
    
}

//get phrese...

const getPhrese=async(req,res)=>{
    try{
        const findPhrese=await phreseService.find();
        
        res.json(findPhrese)

    }catch(error){
        res.status(500).json({
            message:"Server error"
        })
    }
}



module.exports={addPhrese,bulkaddPhress,getPhrese}
