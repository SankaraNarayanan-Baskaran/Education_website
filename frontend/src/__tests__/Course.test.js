import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Course from "../components/Course";

// Mocking axios to prevent actual HTTP requests during testing
jest.mock("axios");

// Sample data for courses
const mockCourses = [
  {
    id: 1,
    course_name: "Course 1",
    course_description: "Description 1",
    video_url: "http://example.com/video1.mp4",
  },
  // Add more courses as needed
];

// Mock the localStorage object
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

// Mock the useNavigate hook
const mockNavigate = jest.fn();

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the ProgressBar component
jest.mock("react-bootstrap", () => ({
  ...jest.requireActual("react-bootstrap"),
  ProgressBar: jest.fn(({ now, label }) => (
    <div>
      <div data-testid="progress-bar">{`Progress: ${now}%`}</div>
      <div data-testid="label">{label}</div>
    </div>
  )),
}));

describe("Course component", () => {
  beforeEach(() => {
    // Clear mocks and set initial values
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it("renders course cards with progress bar", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCourses });

    render(<Course />);

    // Wait for the courses to be loaded
    await screen.findByText("Purchased Courses");

    // Verify that course cards are rendered
    mockCourses.forEach((course) => {
      expect(screen.getByText(course.course_name)).toBeInTheDocument();
      expect(screen.getByText(course.course_description)).toBeInTheDocument();
      expect(screen.getByAltText("Image")).toHaveAttribute("src", course.video_url);
      expect(screen.getByTestId("progress-bar")).toHaveTextContent("Progress: 0%");
    });

    // Verify that ProgressBar is rendered with correct progress
    expect(screen.getByTestId("progress-bar")).toHaveTextContent("Progress: 0%");

    // Verify that the "View Course" button navigates to the correct URL
    userEvent.click(screen.getByText("View Course"));
    expect(mockNavigate).toHaveBeenCalledWith("/courseDetails");
  });

  // Add more test cases as needed
});
