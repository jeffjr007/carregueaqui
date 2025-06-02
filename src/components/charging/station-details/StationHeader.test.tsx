
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StationHeader } from './StationHeader';

describe('StationHeader Component', () => {
  it('renders the station name correctly', () => {
    render(<StationHeader name="Teste Estação" rating={4.5} reviews={10} onClose={() => {}} />);
    expect(screen.getByText('Teste Estação')).toBeInTheDocument();
  });

  it('displays the correct rating and reviews count', () => {
    render(<StationHeader name="Teste Estação" rating={4.5} reviews={10} onClose={() => {}} />);
    expect(screen.getByText('4.5 (10 avaliações)')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onCloseMock = vi.fn();
    render(<StationHeader name="Teste Estação" rating={4.5} reviews={10} onClose={onCloseMock} />);
    
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
