const irregularModel=require("../model/irregularVerb_model");
//singel post controller..
const irregularPost=async(req,res)=>{
    try {
        const {infinitive,simplepast, PastParitciple,Bangla,explan}=req.body;

        const words=new irregularModel({
            infinitive,
            simplepast,
            PastParitciple,
            Bangla,
            explan
        })
        const addwords=await words.save();

        if(addwords){
            res.status(202).json({
                message:"done",
                addwords
            })
        }else{
            res.status(404).json({
                message:"error"
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json("internal server is down ")
        
    }
}

//maltipul controller...

const vocBulk = async (req, res) => {
  try {
    const words = req.body.words;

    if (!Array.isArray(words)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const existingWords = await irregularModel.find({}, { infinitive: 1 });
    const existingSet = new Set(
      existingWords.map(w => w.infinitive.toLowerCase())
    );

    const filteredWords = words.filter(word => {
      return word.infinitive && !existingSet.has(word.infinitive.toLowerCase());
    });

    const result = await irregularModel.insertMany(filteredWords);

    res.json({
      message: "Bulk insert completed",
      added: result.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const irregularGet=async(req,res)=>{
    try {
        const findVerb=await irregularModel.find();

        res.json(findVerb)

    } catch (error) {
        console.log(error);
        res.status(500).json("internal server is down ")
        
    }
}

module.exports={irregularPost,irregularGet,vocBulk}