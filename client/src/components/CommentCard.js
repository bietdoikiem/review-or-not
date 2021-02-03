import React, { useState, useEffect } from 'react';
import './CommentCard.css';

const CommentCard = (props) => {
    return (
        <div className="comment-card">
            {props.children}
        </div>
    )
}

export default CommentCard;