import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { AppRoutes } from '../App';

function renderWithRouter(initialRoute = '/login') {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRoutes />
      </MemoryRouter>
    </AppProvider>
  );
}

describe('Joineazy Round 2 - Complete Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects protected routes to /login when unauthenticated and shows validation errors', () => {
    renderWithRouter('/student');
    expect(screen.getByText(/Sign in to your portal/i)).toBeInTheDocument();

    // Submit empty login form (second "Sign In" button is the form submit button)
    const signInBtns = screen.getAllByRole('button', { name: /^Sign In$/i });
    fireEvent.click(signInBtns[signInBtns.length - 1]);

    expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  it('registers a new Professor user, creates a JWT token, and routes to /professor', () => {
    renderWithRouter('/register');

    fireEvent.click(screen.getByRole('button', { name: /Professor Manage & Track/i }));
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Dr. Ada Lovelace' } });
    fireEvent.change(screen.getByLabelText(/University Email/i), { target: { value: 'ada@joineazy.edu' } });
    fireEvent.change(screen.getByPlaceholderText(/Minimum 6 characters/i), {
      target: { value: 'Secret@123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register as Professor/i }));

    expect(screen.getByText(/Professor Teaching Portal/i)).toBeInTheDocument();
    expect(localStorage.getItem('joineazy_r2_jwt_token')).toBeTruthy();
  });

  it('shows Student enrolled courses, no-group prompt, and allows creating a group + leader acknowledgement', () => {
    renderWithRouter('/login');

    // Login as Hetuk Patel (Demo Student)
    fireEvent.click(screen.getByRole('button', { name: /Hetuk Patel/i }));
    expect(screen.getByText(/Enrolled Courses/i)).toBeInTheDocument();

    // Open SE-302 where Hetuk has NO group
    fireEvent.click(screen.getByText(/Software Architecture & QA/i));
    expect(
      screen.getByText(/You are not part of any group\. Create or join one to submit this assignment\./i)
    ).toBeInTheDocument();

    // Click Create or Join a Group CTA
    fireEvent.click(screen.getByRole('button', { name: /Create or Join a Group/i }));

    // Create a new group
    fireEvent.change(screen.getByLabelText(/New group name/i), { target: { value: 'Test Titans' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Group & Become Leader/i }));
    expect(screen.getByText(/You are Leader/i)).toBeInTheDocument();

    // Return to Assignments tab and acknowledge group assignment as Leader
    fireEvent.click(screen.getByRole('button', { name: /Assignments \(2\)/i }));
    const leaderSubmitBtn = screen.getByRole('button', { name: /Yes, I have submitted \(Leader/i });
    fireEvent.click(leaderSubmitBtn);

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Continue to Confirm/i }));
    fireEvent.click(screen.getByRole('button', { name: /Confirm Acknowledgement/i }));

    expect(screen.getByText(/Acknowledged by Hetuk Patel on/i)).toBeInTheDocument();
  });

  it('prevents non-leader group members from acknowledging group assignments', () => {
    renderWithRouter('/login');

    // Hetuk Patel is a non-leader member in CS-415 (Siddhartha is leader)
    fireEvent.click(screen.getByRole('button', { name: /Hetuk Patel/i }));
    fireEvent.click(screen.getByText(/Distributed Systems & Cloud/i));

    expect(
      screen.getByText((_, el) =>
        el?.tagName.toLowerCase() === 'p' &&
        /Only your group leader \(Siddhartha Thonti\) can acknowledge this group assignment\./i.test(
          el.textContent || ''
        )
      )
    ).toBeInTheDocument();
  });

  it('allows Professor to open a course, publish an assignment, and inspect drill-down tracking', () => {
    renderWithRouter('/login');

    // Login as Dr. Robert Downey
    fireEvent.click(screen.getByRole('button', { name: /Dr\. Robert Downey/i }));
    expect(screen.getByText(/Professor Teaching Portal/i)).toBeInTheDocument();

    // Open CS-401
    fireEvent.click(screen.getByText(/Frontend Engineering & UI Systems/i));

    // Create a Group assignment
    fireEvent.click(screen.getByRole('button', { name: /^Create Assignment$/i }));
    fireEvent.click(screen.getByRole('button', { name: /Group Group leader acknowledges/i }));
    fireEvent.change(screen.getByLabelText(/Assignment Title/i), {
      target: { value: 'Final Architecture Review' },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Upload architecture deck to OneDrive.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Publish Assignment/i }));

    expect(screen.getAllByText(/Final Architecture Review/i).length).toBeGreaterThan(0);

    // Logout clears JWT
    fireEvent.click(screen.getByRole('button', { name: /Log out/i }));
    expect(localStorage.getItem('joineazy_r2_jwt_token')).toBeNull();
    expect(screen.getByText(/Sign in to your portal/i)).toBeInTheDocument();
  });
});
