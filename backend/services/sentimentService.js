// backend/services/sentimentService.js
// REAL SENTIMENT ANALYSIS USING NLP

class SentimentService {
    
    // Sentiment lexicon - AFINN-165 based
    static sentimentLexicon = {
        // Positive words
        'good': 0.3, 'great': 0.6, 'excellent': 0.8, 'amazing': 0.9, 'awesome': 0.8,
        'best': 0.7, 'love': 0.8, 'perfect': 0.7, 'thanks': 0.5, 'thank': 0.5,
        'helpful': 0.5, 'interested': 0.6, 'interest': 0.5, 'want': 0.3,
        'need': 0.3, 'required': 0.2, 'please': 0.2, 'appreciate': 0.6,
        'satisfied': 0.6, 'happy': 0.7, 'glad': 0.5, 'pleased': 0.6,
        'recommend': 0.6, 'quality': 0.5, 'reliable': 0.6, 'durable': 0.6,
        'efficient': 0.6, 'effective': 0.5, 'professional': 0.6,
        
        // Urgency words
        'urgent': 0.7, 'asap': 0.8, 'immediately': 0.8, 'emergency': 0.9,
        'critical': 0.8, 'important': 0.6, 'priority': 0.7, 'quick': 0.5,
        'fast': 0.5, 'soon': 0.4, 'deadline': 0.6, 'rush': 0.8,
        
        // Complaint words
        'bad': -0.5, 'worst': -0.8, 'terrible': -0.9, 'awful': -0.8,
        'poor': -0.6, 'issue': -0.4, 'problem': -0.5, 'broken': -0.7,
        'damage': -0.6, 'delay': -0.5, 'late': -0.5, 'wrong': -0.5,
        'error': -0.5, 'mistake': -0.5, 'complaint': -0.7, 'disappointed': -0.7,
        'frustrated': -0.7, 'annoyed': -0.6, 'unsatisfied': -0.7,
        
        // Inquiry/Interest words
        'price': 0.2, 'cost': 0.2, 'quote': 0.3, 'quotation': 0.3,
        'specification': 0.3, 'specs': 0.3, 'feature': 0.3, 'capability': 0.3,
        'compatible': 0.3, 'support': 0.3, 'warranty': 0.3,
        
        // Business terms
        'purchase': 0.4, 'buy': 0.4, 'order': 0.4, 'bulk': 0.5,
        'wholesale': 0.5, 'distributor': 0.4, 'dealer': 0.4,
        'manufacturing': 0.3, 'factory': 0.3, 'plant': 0.3,
        'industrial': 0.3, 'automation': 0.4, 'control': 0.3
    };

    static analyzeSentiment(text) {
        if (!text) return { score: 0, label: 'Neutral', confidence: 0.5 };

        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2);

        let totalScore = 0;
        let matchedWords = 0;
        let urgentCount = 0;
        let complaintCount = 0;
        let interestCount = 0;

        words.forEach(word => {
            if (this.sentimentLexicon[word]) {
                const score = this.sentimentLexicon[word];
                totalScore += score;
                matchedWords++;
                
                // Count categories
                if (score >= 0.6 && ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'rush'].includes(word)) {
                    urgentCount++;
                }
                if (score <= -0.4) {
                    complaintCount++;
                }
                if (score >= 0.3 && score <= 0.5 && ['price', 'cost', 'quote', 'buy', 'purchase', 'order'].includes(word)) {
                    interestCount++;
                }
            }
        });

        // Calculate average score
        let avgScore = matchedWords > 0 ? totalScore / matchedWords : 0;
        
        // Boost score based on message length and urgency
        if (text.length > 100) avgScore += 0.1;
        if (urgentCount > 0) avgScore += 0.2 * Math.min(urgentCount, 3);
        if (complaintCount > 0) avgScore -= 0.2 * Math.min(complaintCount, 3);
        if (interestCount > 0) avgScore += 0.1 * Math.min(interestCount, 3);
        
        // Normalize between -1 and 1
        avgScore = Math.max(-1, Math.min(1, avgScore));

        // Determine label
        let label = 'Neutral';
        let confidence = 0.6 + (Math.abs(avgScore) * 0.3);

        if (avgScore > 0.5) {
            label = 'Very Interested';
        } else if (avgScore > 0.2) {
            label = 'Interested';
        } else if (avgScore < -0.3) {
            label = 'Complaint';
        } else if (urgentCount > 0) {
            label = 'Urgent';
        }

        // Override for strong signals
        if (urgentCount >= 2) label = 'Urgent';
        if (complaintCount >= 2) label = 'Complaint';
        if (interestCount >= 2) label = 'Interested';

        return {
            score: Number(avgScore.toFixed(3)),
            label,
            confidence: Number(confidence.toFixed(3)),
            metrics: {
                wordCount: words.length,
                matchedWords,
                urgentCount,
                complaintCount,
                interestCount
            }
        };
    }

    static calculateLeadScore(sentiment, timeOnSite = 0, pageViews = 0, productClicks = 0) {
        // Formula: (Sentiment Score * 0.4) + (Time on Site * 0.3) + (Product Clicks * 0.3)
        const normalizedSentiment = (sentiment.score + 1) * 50; // Convert -1..1 to 0..100
        
        // Normalize time on site (max 600 seconds = 100 points)
        const timeScore = Math.min((timeOnSite / 6), 100);
        
        // Normalize page views (max 20 pages = 100 points)
        const pageScore = Math.min((pageViews * 5), 100);
        
        // Product clicks score
        const clickScore = Math.min((productClicks * 10), 100);
        
        // Calculate weighted score
        let leadScore = (
            (normalizedSentiment * 0.4) +
            (timeScore * 0.3) +
            (clickScore * 0.3)
        );
        
        // Boost for urgent inquiries
        if (sentiment.label === 'Urgent') leadScore += 15;
        if (sentiment.label === 'Very Interested') leadScore += 10;
        if (sentiment.label === 'Complaint') leadScore -= 10;
        
        // Ensure within 0-100
        leadScore = Math.max(0, Math.min(100, leadScore));
        
        // Determine quality
        let quality = 'Cold';
        if (leadScore >= 70) quality = 'Hot';
        else if (leadScore >= 40) quality = 'Warm';
        
        return {
            score: Math.round(leadScore),
            quality,
            conversionProbability: Math.round(leadScore * 0.85)
        };
    }
}

module.exports = SentimentService;