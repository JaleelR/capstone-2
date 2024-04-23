import React from 'react';
import axios from 'axios';
import { act, render, waitFor } from '@testing-library/react';
import { UserContext } from '../userContext';
import { InVOut } from '../InVOut';
const { getTransactions } = require('../Api');
const mockUserContext = {
    currentUser: {
        user: {
            username: "testUser",
        },
    },
    balances: [{
        name: "CHECKING",
        balance: '1000.00'
    }],
};

jest.mock('../Api', () => ({
    getTransactions: jest.fn(() => Promise.resolve([])),
}));

it('renders InVOut component', async () => {
    await act(async () => {
        const { getByText, findByText } = render(
            <UserContext.Provider value={mockUserContext}>
                <InVOut />
            </UserContext.Provider>
        );

        // Wait for the component to finish rendering
        // await waitFor(() => {
        //     // Check for 'Income vs spending' text
        //     try {
        //         const textElement = findByText('Income vs spending');
        //         console.log('Text Element:', textElement);
        //         expect(textElement).toBeInTheDocument();
        //     } catch (error) {
        //         console.error("Error finding text:", error);
        //         throw error;
        //     }
        // }, { timeout: 100000 });
    });
})
