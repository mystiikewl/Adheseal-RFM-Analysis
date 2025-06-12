"""
Customer Segment Guide for RFM Analysis

This module provides comprehensive documentation for all customer segments
used in the RFM analysis, including characteristics, business implications,
and recommended marketing strategies.
"""

from typing import Dict, List
from dataclasses import dataclass

@dataclass
class SegmentInfo:
    """Information about a customer segment."""
    name: str
    description: str
    characteristics: List[str]
    marketing_strategy: List[str]
    priority: str  # High, Medium, Low
    risk_level: str  # High, Medium, Low
    revenue_potential: str  # High, Medium, Low

# Comprehensive segment definitions
SEGMENT_DEFINITIONS: Dict[str, SegmentInfo] = {
    "Champions": SegmentInfo(
        name="Champions",
        description="Your absolute best customers who buy recently, frequently, and spend the most",
        characteristics=[
            "Highest RFM scores (5-5-5)",
            "Most recent purchases",
            "Highest transaction frequency", 
            "Highest monetary value",
            "Brand advocates and loyalty program candidates"
        ],
        marketing_strategy=[
            "Reward with exclusive offers and early access",
            "Use as brand ambassadors and testimonials",
            "Provide premium customer service",
            "Cross-sell and upsell premium products",
            "Gather feedback for product development"
        ],
        priority="High",
        risk_level="Low",
        revenue_potential="High"
    ),
    
    "VIP Customers": SegmentInfo(
        name="VIP Customers",
        description="Excellent recent customers with high engagement and spending",
        characteristics=[
            "Recent purchases (R=5)",
            "High frequency (F≥4) and high value (M≥4)",
            "Consistent purchasing behavior",
            "High lifetime value potential"
        ],
        marketing_strategy=[
            "Nurture to become Champions",
            "Offer loyalty programs and exclusive deals",
            "Personalized communication and offers",
            "Premium customer support",
            "Cross-sell complementary products"
        ],
        priority="High",
        risk_level="Low",
        revenue_potential="High"
    ),
    
    "Loyal Customers": SegmentInfo(
        name="Loyal Customers", 
        description="Consistently engaged customers with good recency and high frequency",
        characteristics=[
            "Good recency (R≥3)",
            "High frequency (F≥4)",
            "Moderate to good monetary value (M≥3)",
            "Stable purchasing patterns"
        ],
        marketing_strategy=[
            "Maintain engagement with regular communication",
            "Offer volume discounts and bulk deals",
            "Cross-sell and category expansion",
            "Loyalty program enrollment",
            "Regular check-ins and relationship building"
        ],
        priority="High",
        risk_level="Low",
        revenue_potential="Medium-High"
    ),
    
    "Potential Loyalists": SegmentInfo(
        name="Potential Loyalists",
        description="Recent customers with decent engagement who could become loyal",
        characteristics=[
            "Recent purchases (R≥4)",
            "Moderate frequency and value (F≥2, M≥2)",
            "Growing relationship with brand",
            "Opportunity for loyalty development"
        ],
        marketing_strategy=[
            "Focus on relationship building",
            "Educational content and product tutorials",
            "Targeted promotions to increase frequency",
            "Onboarding sequences for new customers",
            "Feedback collection and engagement"
        ],
        priority="Medium-High",
        risk_level="Medium",
        revenue_potential="Medium-High"
    ),
    
    "Recent Customers": SegmentInfo(
        name="Recent Customers",
        description="New customers with limited purchase history",
        characteristics=[
            "Recent purchases (R≥4)",
            "Low frequency (F≤2) and low value (M≤2)",
            "New to brand or category",
            "Testing phase of relationship"
        ],
        marketing_strategy=[
            "Welcome campaigns and onboarding",
            "Educational content about products",
            "Trial offers and starter packages",
            "Build trust through excellent service",
            "Regular engagement to build habit"
        ],
        priority="Medium",
        risk_level="Medium",
        revenue_potential="Medium"
    ),
    
    "Promising": SegmentInfo(
        name="Promising",
        description="Customers with moderate recency, high value but low frequency",
        characteristics=[
            "Moderate recency (R≥3)",
            "Low frequency (F≤2)",
            "High monetary value (M≥4)",
            "Quality over quantity buyers"
        ],
        marketing_strategy=[
            "Target with high-value, premium offers",
            "Timing-based campaigns around their purchase cycles",
            "Quality content and premium positioning",
            "Exclusive and limited-time offers",
            "Focus on value rather than volume"
        ],
        priority="Medium-High",
        risk_level="Medium",
        revenue_potential="High"
    ),
    
    "Customers Needing Attention": SegmentInfo(
        name="Customers Needing Attention",
        description="Customers with moderate recency but low engagement levels",
        characteristics=[
            "Moderate recency (R≥3)",
            "Low frequency (F≤2)",
            "Low to moderate value (M 2-3)",
            "Declining engagement risk"
        ],
        marketing_strategy=[
            "Re-engagement campaigns",
            "Personalized offers and incentives",
            "Customer service outreach",
            "Feedback surveys to understand issues",
            "Special promotions to reactivate"
        ],
        priority="Medium",
        risk_level="Medium-High",
        revenue_potential="Medium"
    ),
    
    "About to Sleep": SegmentInfo(
        name="About to Sleep",
        description="Previously valuable customers showing declining activity",
        characteristics=[
            "Declining recency (R≤3)",
            "Low frequency (F≤2)",
            "Previously good value (M≥3)",
            "Early warning signs of churn"
        ],
        marketing_strategy=[
            "Win-back campaigns with attractive offers",
            "Personal outreach and customer service calls",
            "Survey to understand satisfaction issues",
            "Special renewal or comeback offers",
            "Reminder campaigns about unused benefits"
        ],
        priority="Medium-High",
        risk_level="High",
        revenue_potential="Medium"
    ),
    
    "At Risk": SegmentInfo(
        name="At Risk",
        description="High-value customers with poor recent engagement",
        characteristics=[
            "Poor recency (R≤2)",
            "Moderate to high frequency (F≥3)",
            "High monetary value (M≥4)",
            "Significant churn risk"
        ],
        marketing_strategy=[
            "Immediate intervention campaigns",
            "Personal account manager assignment",
            "Significant discount or incentive offers",
            "Direct phone outreach",
            "Problem resolution and service recovery"
        ],
        priority="High",
        risk_level="High",
        revenue_potential="High"
    ),
    
    "Cannot Lose Them": SegmentInfo(
        name="Cannot Lose Them",
        description="Previously excellent customers now completely inactive",
        characteristics=[
            "Very poor recency (R≤2)",
            "Previously high frequency (F≥4)",
            "Previously high value (M≥4)",
            "Critical churn risk for high-value customers"
        ],
        marketing_strategy=[
            "Emergency win-back campaigns",
            "Senior management or owner personal outreach",
            "Significant incentives and special offers",
            "Service recovery and issue resolution",
            "VIP treatment and exclusive benefits"
        ],
        priority="Critical",
        risk_level="Critical",
        revenue_potential="High"
    ),
    
    "Lost Customers": SegmentInfo(
        name="Lost Customers",
        description="Very inactive customers who were previously decent buyers",
        characteristics=[
            "Very poor recency (R=1)",
            "Previously moderate engagement (F≥2, M≥2)",
            "Likely churned customers",
            "Long-term win-back candidates"
        ],
        marketing_strategy=[
            "Long-term win-back sequences",
            "Brand awareness and re-introduction campaigns",
            "Significant comeback incentives",
            "Market research and feedback collection",
            "Periodic check-in campaigns"
        ],
        priority="Low-Medium",
        risk_level="Low",
        revenue_potential="Low-Medium"
    ),
    
    "Hibernating": SegmentInfo(
        name="Hibernating",
        description="Customers with consistently low engagement across all metrics",
        characteristics=[
            "Poor recency (R≤2)",
            "Low frequency (F≤2)",
            "Low monetary value (M≤2)",
            "Minimal relationship with brand"
        ],
        marketing_strategy=[
            "Low-cost, automated campaigns",
            "Brand awareness and educational content",
            "Seasonal or event-based reactivation",
            "Basic newsletter and update communication",
            "Consider removal from active marketing lists"
        ],
        priority="Low",
        risk_level="Low",
        revenue_potential="Low"
    ),
    
    "Price Sensitive": SegmentInfo(
        name="Price Sensitive",
        description="Frequent buyers who focus on lower-priced items",
        characteristics=[
            "Good recency (R≥3)",
            "High frequency (F≥4)",
            "Low monetary value (M≤2)",
            "Deal-seekers and bargain hunters"
        ],
        marketing_strategy=[
            "Volume discounts and bulk offers",
            "Clearance and sale notifications",
            "Loyalty programs with cost savings",
            "Bundle deals and package offers",
            "Price-focused communication"
        ],
        priority="Medium",
        risk_level="Low",
        revenue_potential="Medium"
    ),
    
    "Bargain Hunters": SegmentInfo(
        name="Bargain Hunters",
        description="Moderate engagement customers focused on deals and discounts",
        characteristics=[
            "Moderate recency (R≥3)",
            "Moderate frequency (F≥2)",
            "Low monetary value (M≤2)",
            "Price-conscious behavior"
        ],
        marketing_strategy=[
            "Deal alerts and promotional campaigns",
            "Seasonal sales and clearance events",
            "Entry-level product promotions",
            "Cost-saving tips and advice",
            "Value-focused messaging"
        ],
        priority="Low-Medium",
        risk_level="Low",
        revenue_potential="Low-Medium"
    ),
    
    "Other": SegmentInfo(
        name="Other",
        description="Customers with mixed characteristics not fitting specific patterns",
        characteristics=[
            "Various combinations of R, F, M scores",
            "Inconsistent purchasing patterns",
            "Require individual analysis",
            "Potential for segment refinement"
        ],
        marketing_strategy=[
            "Analyze individual customer patterns",
            "Test different marketing approaches",
            "Gather more data for better segmentation",
            "General marketing communications",
            "Monitor for emerging patterns"
        ],
        priority="Variable",
        risk_level="Variable",
        revenue_potential="Variable"
    )
}

def get_segment_info(segment_name: str) -> SegmentInfo:
    """
    Get detailed information about a specific segment.
    
    Args:
        segment_name: Name of the customer segment
        
    Returns:
        SegmentInfo object with segment details
        
    Raises:
        KeyError: If segment name is not found
    """
    if segment_name not in SEGMENT_DEFINITIONS:
        raise KeyError(f"Segment '{segment_name}' not found in segment definitions")
    
    return SEGMENT_DEFINITIONS[segment_name]

def get_all_segments() -> Dict[str, SegmentInfo]:
    """
    Get all segment definitions.
    
    Returns:
        Dictionary of all segment information
    """
    return SEGMENT_DEFINITIONS.copy()

def get_high_priority_segments() -> List[str]:
    """
    Get list of high-priority segment names.
    
    Returns:
        List of segment names with high priority
    """
    return [name for name, info in SEGMENT_DEFINITIONS.items() 
            if info.priority in ["High", "Critical"]]

def get_segments_by_risk(risk_level: str) -> List[str]:
    """
    Get segments filtered by risk level.
    
    Args:
        risk_level: Risk level to filter by ("High", "Medium", "Low", "Critical")
        
    Returns:
        List of segment names matching the risk level
    """
    return [name for name, info in SEGMENT_DEFINITIONS.items() 
            if info.risk_level == risk_level]

def get_revenue_potential_segments(potential: str) -> List[str]:
    """
    Get segments filtered by revenue potential.
    
    Args:
        potential: Revenue potential level ("High", "Medium", "Low")
        
    Returns:
        List of segment names matching the revenue potential
    """
    return [name for name, info in SEGMENT_DEFINITIONS.items() 
            if potential in info.revenue_potential] 