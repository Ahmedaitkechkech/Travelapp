const ClientReview = require('../models/clientReviewSchema');

//  form to add a new review
 const getAddReview = async  (req, res) => {
    const reviews = await ClientReview.find({});

    res.render('client/add-review', { title: 'Add Review',
        reviews
     });
};






//  POST request to add a new review
const postAddReview = async (req, res) => {
    const {  reviewText, rating } = req.body;
    try {
        const newReview = new ClientReview({
            
            reviewText,
            rating
        });
        await newReview.save();
        res.redirect('/add-review'); 
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error adding review' });
    }
};

//   delete a review
const deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    try {
        await ClientReview.findByIdAndDelete(reviewId);
        res.redirect('/add-review'); 
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error deleting review' });
    }
};



module.exports = {
    getAddReview,
    postAddReview,
    deleteReview

   
}
;
