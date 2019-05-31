import Centered from '@codesandbox/common/lib/components/flex/Centered';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { useEffect } from 'react';

import Navigation from 'app/pages/common/Navigation';
import { useSignals } from 'app/store';
import history from 'app/utils/history';

import NewSandboxModal from '../Dashboard/Content/CreateNewSandbox/Modal';

const createSandbox = template => {
  history.push(sandboxUrl({ id: template.shortid }));
};

const NewSandbox = () => {
  const { sandboxPageMounted } = useSignals();

  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  return (
    <MaxWidth
      css={`
        height: 100vh;
      `}
    >
      <Margin horizontal={1.5} style={{ height: '100%' }} vertical={1.5}>
        <Navigation title="New Sandbox" />

        <Margin top={5}>
          <Centered horizontal vertical>
            <Margin style={{ maxWidth: '100%', width: 900 }} top={2}>
              <NewSandboxModal createSandbox={createSandbox} width={980} />
            </Margin>
          </Centered>
        </Margin>
      </Margin>
    </MaxWidth>
  );
};

export default NewSandbox;
