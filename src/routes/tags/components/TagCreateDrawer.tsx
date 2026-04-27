import type React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faHashtag } from "@fortawesome/free-solid-svg-icons/faHashtag";
import type { CreateTagDto } from "../../../model/tag/dto/CreateTagDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { tagActions } from "../../../redux/tag/tags.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { buildTagsParams, parseTagsFiltersFromParams } from "../utils/tagUtils";
import { useSearchParams } from "react-router-dom";
import tagSliceSelectors from "../../../redux/tag/tags.selector";
import { Toast } from "../../../utils/Toast";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
`;

const GlassHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary}0D;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.title};
`;

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.small};
`;

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.glassBackground};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}20;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  h4 {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

type TagCreateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const TagCreateDrawer: React.FC<TagCreateDrawerProps> = ({
  open = false,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const tagsMeta = useAppSelector(tagSliceSelectors.selectTagsMeta);

  const { control, handleSubmit, reset, getValues } = useForm<CreateTagDto>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const filters = useMemo(
    () => parseTagsFiltersFromParams(searchParams, tagsMeta),
    [searchParams, tagsMeta],
  );

  const localOnClose = () => {
    reset();
    onClose();
  };

  const onCreate = async () => {
    try {
      setLoading(true);

      await dispatch(
        tagActions.createTag({
          ...getValues(),
          userId,
        }),
      ).unwrap();

      setSearchParams(buildTagsParams(filters, searchParams), {
        replace: true,
      });

      localOnClose();
      Toast.success("Tag created successfully");
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={localOnClose}
      title="Create Tag"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onCreate)}
          onCancel={localOnClose}
        />
      }
    >
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faTag} />
          </IconWrapper>
          <TitleGroup>
            <MainTitle>New Metadata Tag</MainTitle>
            <Subtitle>Create labels to categorize your inventory</Subtitle>
          </TitleGroup>
        </GlassHeader>

        <FormSection>
          <SectionLabel>
            <Icon icon={faHashtag} />
            <h4>Tag Identity</h4>
          </SectionLabel>

          <Controller
            control={control}
            name="name"
            rules={{ required: "Tag name is required" }}
            render={({ field, fieldState }) => (
              <Input
                title="Tag Name"
                placeholder="e.g. Premium, Bestseller"
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
                placeholder="What is this tag used for?"
                rows={5}
                {...field}
              />
            )}
          />
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
