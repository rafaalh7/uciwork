import React from 'react';

const DocumentIcon = ({ type }) => {
  const getIcon = (docType) => {
    const typeLower = docType?.toLowerCase() || '';
    
    if (typeLower.includes('pdf')) return '📄';
    if (typeLower.includes('word') || typeLower.includes('doc')) return '📝';
    if (typeLower.includes('excel') || typeLower.includes('xls')) return '📊';
    if (typeLower.includes('image')) return '🖼️';
    if (typeLower.includes('video')) return '🎬';
    if (typeLower.includes('audio')) return '🎵';
    if (typeLower.includes('zip') || typeLower.includes('compress')) return '🗜️';
    
    return '📋';
  };
  
  return (
    <span className="document-icon" title={type}>
      {getIcon(type)}
    </span>
  );
};

export default DocumentIcon;