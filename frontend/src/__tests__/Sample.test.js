import { render, screen } from '@testing-library/react'
import Sample from '../components/Sample';

test("Example 1 renders successfully", () => {
    render(<Sample/>);

    const element = screen.getByText(/sample/i);

    expect(element).toBeInTheDocument();
})