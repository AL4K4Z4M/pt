// js/modules/review.js
import { state } from '../state.js';
import * as api from './api.js';
import { updateReviewDetailModalContent, setDetailModalMode, renderReviews } from './render.js';
import { normalizeText, forbiddenWords } from '../constants.js';
import { handleLogout } from './auth.js';

export function processAndSetReviews(reviews) {
    state.allReviewsData = reviews;
    state.aggregatedReviewsData = {};
    reviews.forEach(review => {
        const plate = review.plate_number.toUpperCase();
        if (!state.aggregatedReviewsData[plate]) {
            state.aggregatedReviewsData[plate] = { plate_number: plate, totalRating: 0, reviewCount: 0, averageRating: 0, allReviews: [] };
        }
        state.aggregatedReviewsData[plate].totalRating += review.rating;
        state.aggregatedReviewsData[plate].reviewCount++;
        state.aggregatedReviewsData[plate].averageRating = state.aggregatedReviewsData[plate].totalRating / state.aggregatedReviewsData[plate].reviewCount;
        state.aggregatedReviewsData[plate].allReviews.push(review);
    });
    renderReviews();
}

export async function handleReviewSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = '';
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validation
    if (!data.plate_number.trim()) {
        formMessage.textContent = "Plate number is required.";
        return;
    }
    if (!data.rating) {
        formMessage.textContent = "A star rating is required.";
        return;
    }
    if (forbiddenWords.some(word => normalizeText(data.plate_number).includes(word))) {
        formMessage.textContent = 'Error: Plate number contains forbidden words.';
        return;
    }

    formMessage.textContent = 'Submitting...';
    formMessage.className = 'mt-4 text-center text-gray-500';

    // Construct comment object
    const noCommentCheckbox = document.getElementById('no-comment-checkbox');
    if (noCommentCheckbox.checked) {
        data.comment = null;
    } else {
        const selectedWords = Array.from(formData.keys()).filter(k => k.startsWith('comment_word_')).map(k => formData.get(k));
        data.comment = { template: formData.get('comment_template'), words: selectedWords };
    }
    
    data.rating = Number(data.rating);

    try {
        await api.postReview(data, state.authToken);
        formMessage.textContent = 'Review submitted successfully!';
        formMessage.className = 'mt-4 text-center text-green-500';
        
        const freshReviews = await api.getReviews();
        processAndSetReviews(freshReviews);

        setTimeout(() => {
            document.getElementById('reviewModal').classList.add('hidden');
            form.reset();
            document.getElementById('comment-template').dispatchEvent(new Event('change'));
            document.querySelectorAll('#trait-chips-container .trait-chip').forEach(c => c.classList.remove('active'));
            formMessage.textContent = '';
        }, 1500);

    } catch (error) {
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.className = 'mt-4 text-center text-red-500';
        if (error.message.includes('Authentication failed') || error.message.includes('Token has expired')) {
            setTimeout(() => {
                document.getElementById('reviewModal').classList.add('hidden');
                handleLogout();
                document.getElementById('authModal').classList.remove('hidden');
            }, 2500);
        }
    }
}

export function showReviewDetail(plateNumber) {
    setDetailModalMode('feed');
    state.currentPlateReviews = state.aggregatedReviewsData[plateNumber].allReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    state.currentReviewIndex = 0;
    document.getElementById('reviewDetailModal').classList.remove('hidden');
    updateReviewDetailModalContent(state.currentPlateReviews[state.currentReviewIndex]);
};

export function showPreviousReview() {
    if (state.currentReviewIndex > 0) {
        state.currentReviewIndex--;
        updateReviewDetailModalContent(state.currentPlateReviews[state.currentReviewIndex]);
    }
};

export function showNextReview() {
    if (state.currentReviewIndex < state.currentPlateReviews.length - 1) {
        state.currentReviewIndex++;
        updateReviewDetailModalContent(state.currentPlateReviews[state.currentReviewIndex]);
    }
};

export async function handleVote(clickedVoteType) {
    if (!state.authToken) {
        alert('You must be logged in to vote.');
        return;
    }
    
    const review = state.currentPlateReviews[state.currentReviewIndex];
    const currentVote = state.userVotes[review.id];
    let newVoteType = (clickedVoteType === currentVote) ? 'none' : clickedVoteType;

    // Optimistic UI Update
    const originalUpvotes = review.upvotes;
    const originalDownvotes = review.downvotes;
    if (currentVote === 'up') review.upvotes--;
    if (currentVote === 'down') review.downvotes--;
    if (newVoteType === 'up') review.upvotes++;
    if (newVoteType === 'down') review.downvotes++;
    
    if (newVoteType === 'none') {
        delete state.userVotes[review.id];
    } else {
        state.userVotes[review.id] = newVoteType;
    }
    
    updateReviewDetailModalContent(review);

    try {
        await api.postVote(review.id, newVoteType, state.authToken);
    } catch (error) {
        console.error('Vote failed:', error);
        alert('There was an error submitting your vote. Reverting changes.');
        // Revert UI on failure
        review.upvotes = originalUpvotes;
        review.downvotes = originalDownvotes;
        if(currentVote) {
            state.userVotes[review.id] = currentVote;
        } else {
            delete state.userVotes[review.id];
        }
        updateReviewDetailModalContent(review);
    }
};