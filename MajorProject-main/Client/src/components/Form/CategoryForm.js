import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue, x }) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 d-flex">
          <input
            type="text"
            className="form-control "
            placeholder="Enter new Category"
            value={value}
            required
            onChange={(e) => setValue(e.target.value)}
          />
          <input
            type="submit"
            className="btn btn-outline-success mx-3"
            value={x}
          />
        </div>
      </form>
    </>
  );
};

export default CategoryForm;
