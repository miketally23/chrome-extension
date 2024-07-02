import {
    describe,
    expect,
    test
} from 'vitest';
import { render } from '@testing-library/react'
import {
    PasswordField
} from './PasswordField'
describe('PasswordField', () => {
    test('it renders', () => {
        const { queryByTestId } = render(<PasswordField data-testid="test" value="" />)
        expect(queryByTestId('test')).toBeTruthy()
    })
    test('User can update field', () => {

    })
    test('User can toggle between plain text view and password view', () => {

    })
})