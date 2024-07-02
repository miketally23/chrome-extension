import {
    describe,
    expect,
    test
} from 'vitest';
import {render, screen} from '@testing-library/react'
import {
    PasswordField
} from './PasswordField'
describe('PasswordField', () => {
    test('it renders', () => {
        render(<PasswordField />)
        expect('').toBeFalsy()
    })
})