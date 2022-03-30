import * as React from 'react';
import SelectUnstyled, { selectUnstyledClasses } from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/system';
import { requiredInfo } from "../../App";
import { ethers } from "ethers";
const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7',
  400: '#B2BAC2',
  500: '#A0AAB4',
  600: '#6F7E8C',
  700: '#3E5060',
  800: '#2D3843',
  900: '#1A2027',
};

const StyledButton = styled('button')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 1.2rem;
  box-sizing: border-box;
  min-height: calc(1.5em + 22px);
  min-width: 300px;
  background: rgb(56, 65, 88);
  border: none;
  border-radius: 5px;
  margin: 0.5em;
  padding: 10px;
  text-align: left;
  line-height: 1.5;
  color: white;
  cursor:pointer;

  &:hover {
    background: rgb(28 37 54);
  }

  &.${selectUnstyledClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
  }

  &.${selectUnstyledClasses.expanded} {
    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }
  `,
);

const StyledListbox = styled('ul')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 1rem;
  box-sizing: border-box;
  padding: 5px;
  margin: 10px 0;
  min-width: 320px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
  border-radius: 0.75em;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  overflow: auto;
  outline: 0px;
  `,
);

const StyledOption = styled(OptionUnstyled)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 0.45em;
  cursor: pointer;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }
  `,
);

const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
`;

const CustomSelect = React.forwardRef(function CustomSelect(props, ref) {
  const components = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} ref={ref} components={components} />;
});

const SelectPosition = ({ topDataPrice, setTopDataPrice, setTopDataPosition, bidInterval, setBidInterval }) => {
  let contextData = React.useContext(requiredInfo);
  React.useEffect(async () => {
    const init = async () => {
      if (topDataPrice === null) {
        setTopDataPrice(await contextData.contract.getTopDataItemsPrice())
      }
      if (bidInterval === null) {
        setBidInterval(await contextData.contract.priceInterval())
      }
    }
    init();
  })
  return (
    <>
      {
        topDataPrice !== null ?
          <CustomSelect onChange={(e) => {
            setTopDataPosition(e)
            alert("Your Bid Value Should Higher Than " + (topDataPrice[e - 1]) + " Wei  And It Should Divisible By " + bidInterval)
          }}>
            <StyledOption value={1}>First ({ethers.utils.formatEther(topDataPrice[0])} ETH)</StyledOption>
            <StyledOption value={2}>Second ({ethers.utils.formatEther(topDataPrice[1])} ETH)</StyledOption>
            <StyledOption value={3}>Third ({ethers.utils.formatEther(topDataPrice[2])} ETH)</StyledOption>
            <StyledOption value={4}>Fourth ({ethers.utils.formatEther(topDataPrice[3])} ETH)</StyledOption>
            <StyledOption value={5}>Fifth ({ethers.utils.formatEther(topDataPrice[4])} ETH)</StyledOption>
            <StyledOption value={6}>Sixth ({ethers.utils.formatEther(topDataPrice[5])} ETH)</StyledOption>
            <StyledOption value={7}>Seventh ({ethers.utils.formatEther(topDataPrice[6])} ETH)</StyledOption>
            <StyledOption value={8}>Eighth ({ethers.utils.formatEther(topDataPrice[7])} ETH)</StyledOption>
            <StyledOption value={9}>Ninth ({ethers.utils.formatEther(topDataPrice[8])} ETH)</StyledOption>
            <StyledOption value={10}>Tenth ({ethers.utils.formatEther(topDataPrice[9])} ETH)</StyledOption>
          </CustomSelect>
          : <></>
      }

    </>
  );
}
export default SelectPosition;
