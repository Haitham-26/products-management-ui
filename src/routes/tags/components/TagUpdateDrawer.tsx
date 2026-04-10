import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import type { Tag } from "../../../model/tag/types/Tag";
import type { UpdateTagDto } from "../../../model/tag/dto/UpdateTagDto";
import { tagActions } from "../../../redux/tag/tags.slice";
import { Textarea } from "../../../components/Textarea";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Hero = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeroIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary}1a;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

type TagUpdateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  tag: Tag | null;
};

export const TagUpdateDrawer: React.FC<TagUpdateDrawerProps> = ({
  open = false,
  onClose,
  tag,
}) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const { control, handleSubmit, reset, getValues } = useForm<UpdateTagDto>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (tag && open) {
      reset({
        name: tag.name,
        description: tag?.description,
      });
    }
  }, [tag, open, reset]);

  const onUpdate = async () => {
    if (!tag) {
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        tagActions.updateTag({
          ...getValues(),
          tagId: tag._id,
          userId,
        }),
      ).unwrap();

      await dispatch(tagActions.getTags({ userId })).unwrap();

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Edit tag"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onUpdate)}
          onCancel={onClose}
          editMode
        />
      }
    >
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faTag} />
          </HeroIcon>

          <HeroText>
            <Text fontSize="title">Edit tag</Text>
            <Text fontSize="small" color="textSecondary">
              Update tag information
            </Text>
          </HeroText>
        </Hero>

        <Card>
          <SectionHeader>
            <Icon icon={faTag} />
            <Text fontSize="subtitle">Tag details</Text>
          </SectionHeader>

          <Controller
            control={control}
            name="name"
            rules={{ required: "Tag name is required" }}
            render={({ field, fieldState }) => (
              <Input
                title="Name"
                placeholder="Tag name..."
                errorMessage={fieldState.error?.message}
                required
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                title="Description"
                placeholder="Short description about the tag"
                rows={4}
                {...field}
              />
            )}
          />
        </Card>
      </Content>
    </Drawer>
  );
};
