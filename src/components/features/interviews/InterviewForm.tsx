import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { INTERVIEW_TYPES, INTERVIEW_STATUSES } from '@/lib/constants';
import { useApplicationsStore } from '@/stores/applicationsStore';
import type { Interview } from '@/types';

interface InterviewFormProps {
  interview?: Interview;
  onSubmit: (data: Partial<Interview>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  defaultApplicationId?: string;
}

export function InterviewForm({
  interview,
  onSubmit,
  onCancel,
  isLoading = false,
  defaultApplicationId,
}: InterviewFormProps) {
  const { applications } = useApplicationsStore();

  const getDateValue = () => {
    if (!interview?.scheduledAt) return '';
    const date = new Date(interview.scheduledAt);
    return date.toISOString().split('T')[0];
  };

  const getTimeValue = () => {
    if (!interview?.scheduledAt) return '';
    const date = new Date(interview.scheduledAt);
    return date.toTimeString().slice(0, 5);
  };

  const form = useForm({
    defaultValues: {
      applicationId: interview?.applicationId || defaultApplicationId || '',
      round: interview?.round || 1,
      type: interview?.type || 'phone-screen' as const,
      status: interview?.status || 'scheduled' as const,
      scheduledDate: getDateValue(),
      scheduledTime: getTimeValue(),
      duration: interview?.duration || 60,
      location: interview?.location || '',
      meetingUrl: interview?.meetingUrl || '',
      preparationNotes: interview?.preparationNotes || '',
      feedback: interview?.feedback || '',
    },
    onSubmit: async ({ value }) => {
      const interviewData: Partial<Interview> = {
        applicationId: value.applicationId,
        round: value.round || 1,
        type: value.type,
        status: value.status,
        duration: value.duration,
        location: value.location || undefined,
        meetingUrl: value.meetingUrl || undefined,
        preparationNotes: value.preparationNotes || undefined,
        feedback: value.feedback || undefined,
      };

      if (value.scheduledDate) {
        const dateTime = value.scheduledTime
          ? `${value.scheduledDate}T${value.scheduledTime}`
          : `${value.scheduledDate}T00:00`;
        interviewData.scheduledAt = new Date(dateTime);
      }

      await onSubmit(interviewData);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <form.Field name="applicationId">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Application *</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.position} at {app.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field name="round">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Round</Label>
                <Input
                  id={field.name}
                  type="number"
                  min="1"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="1"
                />
                <p className="text-sm text-muted-foreground">Interview round number</p>
              </div>
            )}
          </form.Field>

          <form.Field name="duration">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Duration (minutes)</Label>
                <Input
                  id={field.name}
                  type="number"
                  min="0"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="60"
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field name="type">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Interview Type *</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as typeof field.state.value)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVIEW_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Status *</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as typeof field.state.value)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVIEW_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* Scheduling */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Scheduling</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field name="scheduledDate">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Date</Label>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="scheduledTime">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Time</Label>
                <Input
                  id={field.name}
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => state.values.type}>
          {(type) => (
            <>
              {(type === 'on-site' || type === 'panel') && (
                <form.Field name="location">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Location</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g., 123 Main St, Office 400"
                      />
                    </div>
                  )}
                </form.Field>
              )}

              {(type === 'video' || type === 'phone-screen') && (
                <form.Field name="meetingUrl">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Meeting URL</Label>
                      <Input
                        id={field.name}
                        type="url"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://zoom.us/j/..."
                      />
                    </div>
                  )}
                </form.Field>
              )}
            </>
          )}
        </form.Subscribe>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notes</h3>
        
        <form.Subscribe selector={(state) => state.values.status}>
          {(status) => (
            <>
              {status === 'scheduled' && (
                <form.Field name="preparationNotes">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Preparation Notes</Label>
                      <Textarea
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Topics to review, questions to prepare, research needed..."
                        className="resize-none"
                        rows={4}
                      />
                    </div>
                  )}
                </form.Field>
              )}

              {status === 'completed' && (
                <form.Field name="feedback">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Feedback</Label>
                      <Textarea
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="How did the interview go? Questions asked, impressions, next steps..."
                        className="resize-none"
                        rows={4}
                      />
                    </div>
                  )}
                </form.Field>
              )}
            </>
          )}
        </form.Subscribe>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : interview ? 'Update Interview' : 'Create Interview'}
        </Button>
      </div>
    </form>
  );
}
