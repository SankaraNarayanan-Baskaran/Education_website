// SearchInput.js
import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <Box width={300}>
    <TextField
      className="search"
      size="small"
      fullWidth
      placeholder="Search for courses"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon
              onClick={handleSearch}
              style={{ cursor: "pointer" }}
            />
          </InputAdornment>
        ),
      }}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        handleSearch();
      }}
    />
  </Box>
);

export default SearchInput;
