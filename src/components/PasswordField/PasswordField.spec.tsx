import {
    describe,
    expect,
    test
} from 'vitest';
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    PasswordField
} from './PasswordField'


describe('PasswordField', () => {
    test('it renders', () => {
        const { queryByTestId } = render(<PasswordField data-testid="test-id" value="test-value" />)
        expect(queryByTestId('test-id')).toBeTruthy()
    })

    test('User can toggle between plain text view and password view', async () => {
        const { getByTestId } = render(<PasswordField data-testid="test-id" value="test-value" />)
        const user = userEvent.setup();
        expect(getByTestId("password-text-indicator").textContent).toBe('😸');
        await user.click(getByTestId('toggle-view-password-btn'));
        expect(getByTestId("plain-text-indicator").textContent).toBe('🙀');
        await user.click(getByTestId('toggle-view-password-btn'));
        expect(getByTestId("password-text-indicator").textContent).toBe('😸');
    })
})