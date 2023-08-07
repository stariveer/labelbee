import { getClassName } from '@/utils/dom';
import React, { useCallback, useEffect, useRef } from 'react';
import AnnotationView from '@/components/AnnotationView';
import useSize from '@/hooks/useSize';
import { useSingleBox } from './hooks/useSingleBox';
import { ViewOperation } from '@labelbee/lb-annotation';
import { IAnnotationData2dView, IAnnotationDataTemporarily } from './PointCloud2DView';

const PointCloud2DSingleView = ({
  view2dData,
  setSelectedID,
}: {
  view2dData: IAnnotationData2dView;
  setSelectedID: (value: string | number) => void;
}) => {
  const ref = useRef(null);
  const viewRef = useRef<{ toolInstance: ViewOperation }>();
  const { selectedBox } = useSingleBox();
  const size = useSize(ref);

  const hiddenData = !view2dData;

  const afterImgOnLoad = useCallback(() => {
    const toolInstance = viewRef.current?.toolInstance;

    // Clear Selected.
    setSelectedID('');

    if (!selectedBox || !toolInstance) {
      return;
    }
    const selected2data = view2dData.annotations.find(
      (v: IAnnotationDataTemporarily) => v.annotation.id === selectedBox.info.id,
    );

    let id = '';
    if (selected2data && selected2data?.annotation.pointList?.length > 0) {
      toolInstance.focusPositionByPointList(selected2data?.annotation.pointList);
      id = selectedBox.info.id;
      setSelectedID(id);
    }
  }, [selectedBox, viewRef.current, view2dData.annotations]);

  /**
   * If the status is updated, it needs to
   */
  useEffect(() => {
    afterImgOnLoad();
  }, [afterImgOnLoad]);

  return (
    <div className={getClassName('point-cloud-2d-image')} ref={ref}>
      <AnnotationView
        src={view2dData?.url ?? ''}
        annotations={view2dData.annotations}
        size={size}
        ref={viewRef}
        globalStyle={{
          display: hiddenData ? 'none' : 'block',
        }}
        afterImgOnLoad={afterImgOnLoad}
        zoomInfo={{
          min: 0.01,
          max: 1000,
          ratio: 0.4,
        }}
      />
    </div>
  );
};

export default PointCloud2DSingleView;
