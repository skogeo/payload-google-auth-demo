import { NavGroup } from 'payload/components/elements';
import { AdminViewComponent } from 'payload/config';
import React from 'react';
import { Link } from 'react-router-dom';

const CustomLink = () => {
  return (
    <NavGroup label="Custom Links">
      <Link to="/admin/my-custom-view">Link </Link>
    </NavGroup>
  );
};

export default CustomLink;
